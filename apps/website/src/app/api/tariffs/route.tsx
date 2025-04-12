// import connection function thing
import { connectToDatabase } from "/Users/kaisprunger/tarrifix/TarrifFix/lib/mongodb.js";
// import scheme
import {Rate} from "/Users/kaisprunger/tarrifix/TarrifFix/lib/models/Rate.js";
import { NextResponse } from "next/server";

// trying to get a response
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
    return new NextResponse(JSON.stringify({ error: "Failed to fetch rates" }), {
      status: 500,
    });
  }
}