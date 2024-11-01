import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {

    const url = new URL(request.url);
    const userId = url.searchParams.get('userid');
    const userIdNumber = userId ? parseInt(userId, 10) : undefined;

    try {
        const symptoms = await prisma.symptom.findUnique({
            where: { userId: userIdNumber },
        });
        return NextResponse.json(symptoms, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error}, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { nausea,
        fatigue,
        moodSwings,
        createdAt,
        userId } = await req.json();

    if (!nausea || !fatigue || !moodSwings || !createdAt || !userId) {
        return NextResponse.json({ error: 'Incomplete Data' }, { status: 400 });
    }

    try {

        const existingSymptom = await prisma.symptom.findUnique({
            where: { userId },
        });

        let newSymptom;
        if (existingSymptom) {
            newSymptom = await prisma.symptom.update({
            where: { userId },
            data: {
                nausea,
                fatigue,
                moodSwings,
            },
            });
        } else {
            newSymptom = await prisma.symptom.create({
            data: {
                nausea,
                fatigue,
                moodSwings,
                createdAt,
                userId
            },
            });
        }

        return NextResponse.json(newSymptom, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
