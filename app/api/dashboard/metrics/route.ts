import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userid');
    const userIdNumber = userId ? parseInt(userId, 10) : undefined;

    try {
        const metrics = await prisma.metrics.findUnique({
            where: { userId: userIdNumber },
        });
        return NextResponse.json(metrics, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { userId, age, bloodPressure, glucose, heartRate, gestationalAge} = data;

        const existingMetric = await prisma.metrics.findUnique({
            where: { userId },
        });

        let newMetric;
        if (existingMetric) {
            newMetric = await prisma.metrics.update({
            where: { userId },
            data: {
                age,
                bloodPressure,
                glucose,
                heartRate,
                gestationalAge,
            },
            });
        } else {
            newMetric = await prisma.metrics.create({
            data: {
                userId,
                age,
                bloodPressure,
                glucose,
                heartRate,
                gestationalAge,
            },
            });
        }

        return NextResponse.json(newMetric, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
