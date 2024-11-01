import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deleteExpiredReminders = async () => {
    try {
      await prisma.reminder.deleteMany({
        where: {
          date: {
            lt: new Date(), // lt means "less than" (i.e., before the current date)
          },
        },
      });
      console.log("Expired reminders deleted.");
    } catch (error) {
      console.error("Error deleting expired reminders:", error);
    }
};

export async function GET(request: Request) {
    deleteExpiredReminders();

    const url = new URL(request.url);
    const userId = url.searchParams.get('userid');

    try {
        const reminders = await prisma.reminder.findMany({
            where: { userId: Number(userId) },
        });
        return NextResponse.json(reminders, { status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { userId, text, date } = data;

        const newReminder = await prisma.reminder.create({
            data: {
                userId: Number(userId),
                text,
                date: new Date(date),
            },
        });

        return NextResponse.json(newReminder, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
    }
}