import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch mood entries for a specific user
export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userid');
    const dateParam = url.searchParams.get('date'); // Date should be passed in 'YYYY-MM-DD' format

    if (!userId || !dateParam) {
        return NextResponse.json({ error: 'User ID and date are required' }, { status: 400 });
    }

    try {
        // Parse the date parameter
        const date = new Date(dateParam);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Set time to the start of the day
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Set time to the end of the day

        // Fetch mood entry for the given user and date range
        const moodEntry = await prisma.mood.findFirst({
            where: {
                userId: Number(userId),
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        if (!moodEntry) {
            return NextResponse.json({ message: 'No mood entry found for this date' }, { status: 404 });
        }

        return NextResponse.json(moodEntry, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch mood entry' }, { status: 500 });
    }
}

// POST: Create a new mood entry for a user
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { userId, mood, sleep, date } = data;

        if (userId === undefined || mood === undefined || sleep === undefined || !date) {
            return NextResponse.json({ error: 'Incomplete data' }, { status: 400 });
        }

        // Parse the date and set it to the start of the day
        const entryDate = new Date(date);
        const startOfDay = new Date(entryDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(entryDate.setHours(23, 59, 59, 999));

        // Check if a mood entry already exists for the given user and date range
        const existingMoodEntry = await prisma.mood.findFirst({
            where: {
                userId: Number(userId),
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        let moodEntry;
        if (existingMoodEntry) {
            // Update the existing record
            moodEntry = await prisma.mood.update({
                where: {
                    id: existingMoodEntry.id,
                },
                data: {
                    mood,
                    sleep,
                },
            });
        } else {
            // Create a new record
            moodEntry = await prisma.mood.create({
                data: {
                    userId: Number(userId),
                    mood,
                    sleep,
                    date: startOfDay, // Save the date with time set to the start of the day
                },
            });
        }

        return NextResponse.json(moodEntry, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create or update mood entry' }, { status: 500 });
    }
}
