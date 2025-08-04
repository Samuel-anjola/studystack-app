import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    console.log("Received request to save user:", request);
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("studystack");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ id: user.id });
    if (!existingUser) {
      await collection.insertOne({...user, createdAt: new Date(), role: request.role || "user", matric_number: request.matric_number || ""});
    }

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
