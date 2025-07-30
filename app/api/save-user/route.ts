import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();

    if (!bodyText) {
      throw new Error("No JSON body provided");
    }

    const body = JSON.parse(bodyText);

    const client = await clientPromise;
    const db = client.db("studystack");
    const collection = db.collection("users");

    await collection.insertOne(body);

    return NextResponse.json({ message: "User saved" }, { status: 200 });
  } catch (error) {
    console.error("❌ MongoDB insert error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error while saving user",
      },
      { status: 500 }
    );
  }
}

