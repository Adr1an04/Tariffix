import { connectToDatabase } from '../../../../lib/mongodb';
import { Rate } from '../../../../lib/models/Rate';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all rates from the database
    const rates = await Rate.find().lean();

    // Ensure we have a valid array
    if (!Array.isArray(rates)) {
      throw new Error('Invalid data format from database');
    }

    // Return the rates as JSON with proper headers
    return NextResponse.json(rates, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch rates", details: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 