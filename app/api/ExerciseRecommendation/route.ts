import { NextResponse } from 'next/server';

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
  // Extract trimester from query parameters
  const { searchParams } = new URL(request.url);
  const trimester = searchParams.get('trimester')?.toLowerCase();

  // Validate the trimester and return recommendations
  if (trimester && exerciseRecommendations[trimester as Trimester]) {
    return NextResponse.json(exerciseRecommendations[trimester as Trimester]);
  }

  // Return error if trimester is invalid or not provided
  return NextResponse.json({ error: 'Please provide a valid trimester (first, second, third).' }, { status: 400 });
}
