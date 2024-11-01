import { NextResponse } from 'next/server';

// Function to generate suggestions
function generateSuggestions(nauseaLevel: number, fatigueLevel: number, moodSwingsLevel: number) {
  const suggestions: string[] = [];

  // Nausea Suggestions
  if (nauseaLevel >= 7) {
    suggestions.push('Try eating small, frequent meals to help with nausea.');
  } else if (nauseaLevel >= 4 && nauseaLevel < 7) {
    suggestions.push('Stay hydrated and avoid strong odors that may trigger nausea.');
  } else {
    suggestions.push('Keep monitoring your nausea; it seems to be under control.');
  }

  // Fatigue Suggestions
  if (fatigueLevel >= 7) {
    suggestions.push('Consider taking short naps during the day to combat fatigue.');
  } else if (fatigueLevel >= 4 && fatigueLevel < 7) {
    suggestions.push('Try moderate exercise like walking to boost your energy levels.');
  } else {
    suggestions.push('Fatigue levels seem low; maintain a regular sleep schedule.');
  }

  // Mood Swings Suggestions
  if (moodSwingsLevel >= 7) {
    suggestions.push('Practice relaxation techniques like deep breathing or meditation.');
  } else if (moodSwingsLevel >= 4 && moodSwingsLevel < 7) {
    suggestions.push('Engage in activities that make you happy, like hobbies or light exercise.');
  } else {
    suggestions.push('Your mood seems stable; continue to engage in positive activities.');
  }

  return suggestions;
}

// POST handler for the API route
export async function POST(request: Request) {
  try {
    const { nausea, fatigue, moodSwings } = await request.json();

    // Generate suggestions based on the input
    const suggestions = generateSuggestions(nausea, fatigue, moodSwings);

    // Return suggestions in JSON format
    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json({ error: 'Invalid input or internal error.' }, { status: 500 });
  }
}
