import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "tariff"; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const htsno = searchParams.get("htsno");

    if (!htsno) {
      return NextResponse.json({ error: "Missing htsno parameter" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("rates"); 

    const result = await collection.findOne({ htsno });

    if (!result) {
      return NextResponse.json({ error: "HTSNO not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}