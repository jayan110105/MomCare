import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userid');
    const dateParam = url.searchParams.get('date');

    if (!userId || !dateParam) {
        return NextResponse.json({ error: 'User ID and date are required' }, { status: 400 });
    }

    try {
        const date = new Date(dateParam);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const exercises = await prisma.exercise.findMany({
            where: {
                userId: Number(userId),
                date: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
            orderBy: {
                date: 'asc',
            },
        });
        return NextResponse.json(exercises, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { userId, type, duration, intensity} = data;

        const newExercise = await prisma.exercise.create({
            data: {
                userId: Number(userId),
                type,
                duration,
                intensity,
            },
        });

        return NextResponse.json(newExercise, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create exercise' , desc: error}, { status: 500 });
    }
}
