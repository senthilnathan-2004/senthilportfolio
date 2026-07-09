"use server";

import connectDB from "@/lib/db";
import Hero from "@/models/Hero";
import { revalidatePath } from "next/cache";

export async function getHero() {
  await connectDB();
  const hero = await Hero.findOne().lean();
  return JSON.parse(JSON.stringify(hero));
}

export async function updateHero(data: {
  badgeText?: string;
  headline?: string;
  portraitImageUrl?: string;
  portraitImageFileId?: string;
  portraitAlt?: string;
  captionName?: string;
  socialLinks?: Array<{ platform: string; url: string; order: number }>;
}) {
  await connectDB();
  const hero = await Hero.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
  });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(hero));
}
