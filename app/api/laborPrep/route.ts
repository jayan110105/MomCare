import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all checklist items for a specific user
export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userid');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const checklist = await prisma.checklist.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: 'asc' }, // Order by creation time
        });
        return NextResponse.json(checklist, { status: 200 });
    } catch (error) {
        console.error('Error fetching checklist:', error);
        return NextResponse.json({ error: 'Failed to fetch checklist' }, { status: 500 });
    }
}

// POST: Create a new checklist item for a user
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { userId, text} = data;

        if (!userId || !text) {
            return NextResponse.json({ error: 'User ID and text are required' }, { status: 400 });
        }

        const newChecklistItem = await prisma.checklist.create({
            data: {
                userId: Number(userId),
                text,
            },
        });

        return NextResponse.json(newChecklistItem, { status: 201 });
    } catch (error) {
        console.error('Error creating checklist item:', error);
        return NextResponse.json({ error: 'Failed to create checklist item' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { id, completed } = data;

        if (id === undefined || completed === undefined) {
            return NextResponse.json({ error: 'ID and completed status are required' }, { status: 400 });
        }

        const updatedChecklistItem = await prisma.checklist.update({
            where: { id: Number(id) },
            data: { completed },
        });

        return NextResponse.json(updatedChecklistItem, { status: 200 });
    } catch (error) {
        console.error('Error updating checklist item:', error);
        return NextResponse.json({ error: 'Failed to update checklist item' }, { status: 500 });
    }
}

