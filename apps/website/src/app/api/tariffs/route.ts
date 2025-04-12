import { connectToDatabase } from '../../../../lib/mongodb';
import { Rate } from '../../../../lib/models/Rate';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all rates from the database
    const rates = await Rate.find();

    // Return the rates as JSON
    return NextResponse.json(rates);
  } catch (error) {
    console.error("Error fetching rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch rates" },
      { status: 500 }
    );
  }
} 