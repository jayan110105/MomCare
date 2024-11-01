import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userid');
    const userIdNumber = userId ? parseInt(userId, 10) : undefined;

    try {
        const nutritionData = await prisma.nutrition.findUnique({
            where: { userId: userIdNumber },
        });

        if (!nutritionData) {
            return NextResponse.json({ error: 'Nutrition data not found' }, { status: 404 });
        }

        const formattedData = {
            calories: { value: nutritionData.calorie, target: nutritionData.calorieReq },
            protein: { value: nutritionData.protein, target: nutritionData.proteinReq },
            fats: { value: nutritionData.fats, target: nutritionData.fatsReq },
            carbs: { value: nutritionData.carbs, target: nutritionData.carbsReq },
            fibre: { value: nutritionData.fibre, target: nutritionData.fibreReq },
        };

        return NextResponse.json(formattedData, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching nutrition data', details: error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const {
        calorie,
        calorieReq,
        protein,
        proteinReq,
        fats,
        fatsReq,
        carbs,
        carbsReq,
        fibre,
        fibreReq,
        createdAt,
        userId,
    } = await req.json();

    if (
        calorie === undefined ||
        calorieReq === undefined ||
        protein === undefined ||
        proteinReq === undefined ||
        fats === undefined ||
        fatsReq === undefined ||
        carbs === undefined ||
        carbsReq === undefined ||
        fibre === undefined ||
        fibreReq === undefined ||
        !createdAt ||
        !userId
    ) {
        return NextResponse.json({ error: 'Incomplete Data' }, { status: 400 });
    }

    try {
        const userIdNumber = parseInt(userId, 10);

        const existingNutrition = await prisma.nutrition.findUnique({
            where: { userId: userIdNumber },
        });

        let newNutrition;
        if (existingNutrition) {
            newNutrition = await prisma.nutrition.update({
                where: { userId: userIdNumber },
                data: {
                    calorie,
                    calorieReq,
                    protein,
                    proteinReq,
                    fats,
                    fatsReq,
                    carbs,
                    carbsReq,
                    fibre,
                    fibreReq,
                },
            });
        } else {
            newNutrition = await prisma.nutrition.create({
                data: {
                    calorie,
                    calorieReq,
                    protein,
                    proteinReq,
                    fats,
                    fatsReq,
                    carbs,
                    carbsReq,
                    fibre,
                    fibreReq,
                    createdAt: new Date(createdAt),
                    userId: userIdNumber,
                },
            });
        }

        return NextResponse.json(newNutrition, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error saving nutrition data', details: error }, { status: 500 });
    }
}
