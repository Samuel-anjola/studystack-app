import cloudinary from "@/lib/cloudinary";
import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
