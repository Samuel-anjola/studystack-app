import cloudinary from "@/lib/cloudinary";
import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response("File not found", { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await cloudinary.uploader.upload(
      `data:${file.type};base64,${fileBuffer.toString("base64")}`,
      {
        resource_type: "auto",
        folder: "notes",
      }
    );

    if (!uploadResult.secure_url) {
      throw new Error("Upload failed, no secure URL returned");
    }

    const db = (await clientPromise).db();
    await db.collection("course_notes").insertOne({
      courseTitle: formData.get("courseTitle") as string,
      level: formData.get("level") as string,
      year: formData.get("year") as string,
      semester: formData.get("semester") as string,
      department: formData.get("department") as string,
      fileUrl: uploadResult.secure_url,
      uploadedAt: new Date(),
      uploadedBy: user?.email || "",
      uploadedByName: user?.family_name || "" + " " + user?.given_name || "",
      uploadedById: user?.id || "",
    });

    return new Response("Upload success", { status: 200 });
  } catch (error) {
    console.error("Upload failed:", error);
    return new Response("Upload failed", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseTitle = searchParams.get("courseTitle");
  const level = searchParams.get("level");
  const year = searchParams.get("year");
  const semester = searchParams.get("semester");
  const department = searchParams.get("department");

  const db = (await clientPromise).db();
  const query: any = {};

  if (courseTitle) query.courseTitle = courseTitle;
  if (level) query.level = level;
  if (year) query.year = year;
  if (semester) query.semester = semester;
  if (department) query.department = department;

  const notes = await db.collection("course_notes").find(query).toArray();

  return new Response(JSON.stringify(notes), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const noteId = searchParams.get("noteId");

  if (!noteId) {
    return new Response("Note ID is required", { status: 400 });
  }

  try {
    const db = (await clientPromise).db();
    const result = await db
      .collection("course_notes")
      .deleteOne({ _id: new ObjectId(noteId) });

    if (result.deletedCount === 0) {
      return new Response("Note not found", { status: 404 });
    }

    return new Response("Note deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Delete failed:", error);
    return new Response("Delete failed", { status: 500 });
  }
}
