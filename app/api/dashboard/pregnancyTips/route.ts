import { NextResponse } from 'next/server';

// Array of pregnancy tips
const pregnancyTips = [
  "Stay hydrated: Aim for 8-10 glasses of water today.",
  "Take a 15-minute walk to boost your energy.",
  "Include more fruits and vegetables in your meals for essential vitamins.",
  "Take deep breaths and relax to reduce stress for you and your baby.",
  "Ensure you're getting enough protein in your diet: include lean meats, eggs, or beans.",
  "Take time for yourself: practice mindfulness or meditate for 10 minutes today.",
  "Get plenty of rest: try to take short naps during the day if you're feeling tired.",
  "Focus on posture: Sit up straight and avoid slouching to support your back.",
  "Remember to take your prenatal vitamins daily to support your baby's development.",
  "Eat smaller, frequent meals to help with nausea and heartburn.",
  "Do some gentle stretches in the morning to ease muscle stiffness.",
  "Include a calcium-rich snack, like yogurt or almonds, to strengthen bones for you and your baby.",
  "If you feel overwhelmed, talk to a loved one or your healthcare provider for support.",
  "Try a prenatal yoga class to strengthen your body and relax your mind."
];

// Helper function to get two random tips
function getRandomTips() {
  const shuffled = pregnancyTips.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}

// API handler for GET request
export async function GET() {
  const randomTips = getRandomTips();
  return NextResponse.json({ tips: randomTips });
}
