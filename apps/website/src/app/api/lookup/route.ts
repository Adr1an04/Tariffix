import { NextResponse } from "next/server";
import { connectToDatabase } from '../../../../lib/mongodb';
import { Rate } from '../../../../lib/models/Rate';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const htsno = searchParams.get("htsno");

    if (!htsno) {
      return NextResponse.json({ error: "Missing htsno parameter" }, { status: 400 });
    }

    await connectToDatabase();
    const result = await Rate.findOne({ htsno });

    if (!result) {
      return NextResponse.json({ error: "HTSNO not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}