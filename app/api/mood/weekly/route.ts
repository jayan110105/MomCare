import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch weekly mood entries for a specific user
export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userid');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Get the start and end date for the current week (past 7 days)
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 6); // 7 days ago

        // Fetch mood entries for the user within the past 7 days
        const weeklyMoods = await prisma.mood.findMany({
            where: {
                userId: Number(userId),
                date: {
                    gte: startDate,
                    lte: today,
                },
            },
            orderBy: {
                date: 'asc', // Order by date in ascending order
            },
        });

        // Prepare the response data in the format expected by setWeeklyMood
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const formattedMoods = Array.from({ length: 7 }).map((_, index) => {
            const currentDate = new Date();
            currentDate.setDate(today.getDate() - (6 - index)); // Calculate each date for the last 7 days
            const currentDay = daysOfWeek[currentDate.getDay()];

            // Find the mood entry for the current date, if any
            const moodEntry = weeklyMoods.find(entry => {
                return entry.date.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0];
            });

            return {
                day: currentDay,
                mood: moodEntry ? moodEntry.mood : 0, // Use mood if found, otherwise set to null or a default value
            };
        });

        return NextResponse.json(formattedMoods, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch weekly mood entries' }, { status: 500 });
    }
}
