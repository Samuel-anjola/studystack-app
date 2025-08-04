import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
  try {
    // request body will contain the user matric number and role
    const request = await req.json();
    console.log("Received request to save user:", request);

    //the other user information (name, id, email) is gotten from kinde
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("studystack");
    const collection = db.collection("users");

    // check if user already exists in the database
    const existingUser = await collection.findOne({ id: user.id });
    if (!existingUser) {
      await collection.insertOne({...user, createdAt: new Date(), role: request.role || "user", matric_number: request.matric_number || ""});
    }

    const response = NextResponse.json({ message: "User role saved" }, { status: 200 });

    // add user role to cookie, to be used later in middleware
    if(request.role) {
      response.cookies.set("userRole", request.role, {
        httpOnly: true,
        sameSite: "strict",
      });
    }
      
    return response;
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
