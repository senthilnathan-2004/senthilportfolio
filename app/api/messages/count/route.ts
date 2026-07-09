import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function GET() {
  try {
    await connectDB();
    const count = await ContactMessage.countDocuments({ read: false });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
