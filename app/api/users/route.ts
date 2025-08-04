import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const db = (await clientPromise).db();
    const users = await db.collection("users").find().toArray();
  
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }