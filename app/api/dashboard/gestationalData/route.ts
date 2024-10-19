import { NextResponse } from 'next/server';

// Gestational data (in kilograms)
const gestationalAgeData = [
  {
    weeksRange: "1-4",
    size: "poppy seed",
    weight: "0.001 kg", 
  },
  {
    weeksRange: "5-8",
    size: "raspberry",
    weight: "0.001 kg", 
  },
  {
    weeksRange: "9-12",
    size: "lime",
    weight: "0.014 kg", 
  },
  {
    weeksRange: "13-16",
    size: "avocado",
    weight: "0.1 kg", 
  },
  {
    weeksRange: "17-20",
    size: "banana",
    weight: "0.3 kg", 
  },
  {
    weeksRange: "21-24",
    size: "ear of corn",
    weight: "0.59 kg", 
  },
  {
    weeksRange: "25-28",
    size: "cauliflower",
    weight: "1 kg", 
  },
  {
    weeksRange: "29-32",
    size: "butternut squash",
    weight: "1.7 kg", 
  },
  {
    weeksRange: "33-36",
    size: "pineapple",
    weight: "2.6 kg", 
  },
  {
    weeksRange: "37-40",
    size: "watermelon",
    weight: "3.4 kg", 
  }
];

// Helper function to get baby size and weight based on gestational week
function getBabySizeAndWeight(gestationalWeek: number) {
  const data = gestationalAgeData.find((item) => {
    const [start, end] = item.weeksRange.split("-").map(Number);
    return gestationalWeek >= start && gestationalWeek <= end;
  });

  if (data) {
    return {
      fetalSize: data.size,
      fetalWeight: data.weight,
    };
  } else {
    return null;
  }
}

// API handler for GET request
export async function GET(request: Request) {
  // Extract gestationalWeek from query parameters
  const { searchParams } = new URL(request.url);
  const gestationalWeek = searchParams.get('gestationalAge');

  // Validate the input
  if (!gestationalWeek || isNaN(Number(gestationalWeek))) {
    return NextResponse.json({ message: 'Please provide a valid gestational week.' }, { status: 400 });
  }

  const week = Number(gestationalWeek);
  const result = getBabySizeAndWeight(week);

  if (result) {
    return NextResponse.json(result, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Gestational week data not found.' }, { status: 404 });
  }
}
