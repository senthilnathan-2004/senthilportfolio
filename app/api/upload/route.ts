import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("fileName") || "upload";
  const folder = searchParams.get("folder") || "/portfolio";

  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json({
      ...authParams,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      fileName,
      folder,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate upload credentials" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { fileId } = await req.json();
  if (!fileId) {
    return NextResponse.json({ error: "fileId required" }, { status: 400 });
  }

  try {
    await imagekit.deleteFile(fileId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
