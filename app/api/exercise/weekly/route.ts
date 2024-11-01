import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userid');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);  // Start of the week (last 7 days)

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Fetch all exercises in the last 7 days for the user
        const exercises = await prisma.exercise.findMany({
            where: {
                userId: Number(userId),
                date: {
                    gte: startDate,
                    lte: new Date(),  // Current date (today)
                },
            },
        });

        // Calculate total minutes exercised
        const totalMinutesExercised = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);

        // Calculate days active by counting unique days
        const uniqueActiveDays = new Set(exercises.map(exercise => exercise.date.toISOString().split('T')[0])).size;

        // Prepare response data
        const progressData = {
            totalMinutesExercised,
            daysActive: uniqueActiveDays,
        };

        return NextResponse.json(progressData, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch weekly progress' }, { status: 500 });
    }
}
