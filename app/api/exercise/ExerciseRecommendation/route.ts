import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the type for the keys of exerciseRecommendations
type Trimester = 'first' | 'second' | 'third';

// Exercise recommendations by trimester
const exerciseRecommendations: Record<Trimester, { type: string; description: string; }[] > = {
  first: [
      { type: 'Walking', description: 'Brisk Walking: 30 minutes, 5 days a week'},
      { type: 'Yoga', description: 'Prenatal Yoga: 2-3 times a week'},
      { type: 'Strength Training', description: 'Light Strength Training: 2 times a week'},
      { type: 'Pelvic Exercises', description: 'Pelvic Floor Exercises (Kegels): Daily'},
      { type: 'Swimming', description: 'Swimming or Aqua Aerobics: 1-2 times a week'},
    ],
  second: [
      { type: 'Walking', description: 'Brisk Walking or Low-Impact Cardio: 30-45 minutes, 5 days a week'},
      { type: 'Yoga', description: 'Prenatal Yoga: 2-3 times a week'},
      { type: 'Strength Training', description: 'Light Strength Training: 2-3 times a week'},
      { type: 'Pelvic Exercises', description: 'Pelvic Floor Exercises (Kegels): Daily'},
      { type: 'Swimming', description: 'Swimming or Aqua Aerobics: 1-2 times a week'},
    ],
  third: [
      { type: 'Walking', description: 'Gentle Walking: 30 minutes, 5 days a week'},
      { type: 'Yoga', description: 'Prenatal Yoga: 1-2 times a week'},
      { type: 'Strength Training', description: 'Light Strength Training: 1-2 times a week'},
      { type: 'Pelvic Exercises', description: 'Pelvic Tilts and Pelvic Floor Exercises (Kegels): Daily'},
      { type: 'Swimming', description: 'Swimming or Aqua Aerobics: 1-2 times a week'},
    ]
};

// API handler
export async function GET(request: Request) {

  const url = new URL(request.url);
  const userId = url.searchParams.get('userid');

  if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
      // Fetch the metrics data for the specified user ID
      const metrics = await prisma.metrics.findUnique({
          where: { userId: Number(userId) },
      });

      if (!metrics || metrics.gestationalAge === undefined) {
          return NextResponse.json({ error: 'No gestational age data found' }, { status: 404 });
      }

      const gestationalAge = metrics.gestationalAge;

      // Determine the trimester based on gestational age
      let trimester;
      if (gestationalAge < 13) {
          trimester = 'first';
      } else if (gestationalAge < 28) {
          trimester = 'second';
      } else {
          trimester = 'third';
      }

      // Assign recommendations based on the trimester
      if (trimester && exerciseRecommendations[trimester as Trimester]) {
        return NextResponse.json(exerciseRecommendations[trimester as Trimester]);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
