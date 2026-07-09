"use server";

import connectDB from "@/lib/db";
import About from "@/models/About";
import { revalidatePath } from "next/cache";

export async function getAbout() {
  await connectDB();
  const about = await About.findOne().lean();
  return JSON.parse(JSON.stringify(about));
}

export async function updateAbout(data: {
  tagLabel?: string;
  bioRichText?: string;
  cvUrl?: string;
  cvFileId?: string;
  imageUrl?: string;
  imageFileId?: string;
  imageAlt?: string;
}) {
  await connectDB();
  const about = await About.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
  });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(about));
}
