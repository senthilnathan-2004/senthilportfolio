"use server";

import connectDB from "@/lib/db";
import Skill from "@/models/Skill";
import Stat from "@/models/Stat";
import { revalidatePath } from "next/cache";

// --- Skills ---
export async function getSkills() {
  await connectDB();
  const skills = await Skill.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(skills));
}

export async function createSkill(data: { name: string; iconUrl?: string; iconFileId?: string; level?: number; order?: number; category?: string }) {
  await connectDB();
  const skill = await Skill.create(data);
  revalidatePath("/");
  return JSON.parse(JSON.stringify(skill));
}

export async function updateSkill(id: string, data: Partial<{ name: string; iconUrl: string; iconFileId: string; level: number; order: number; category: string }>) {
  await connectDB();
  const skill = await Skill.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(skill));
}

export async function deleteSkill(id: string) {
  await connectDB();
  await Skill.findByIdAndDelete(id);
  revalidatePath("/");
}

export async function reorderSkills(ids: string[]) {
  await connectDB();
  await Promise.all(ids.map((id, index) => Skill.findByIdAndUpdate(id, { order: index })));
  revalidatePath("/");
}

// --- Stats ---
export async function getStats() {
  await connectDB();
  const stats = await Stat.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(stats));
}

export async function createStat(data: { number: string; label: string; order?: number }) {
  await connectDB();
  const stat = await Stat.create(data);
  revalidatePath("/");
  return JSON.parse(JSON.stringify(stat));
}

export async function updateStat(id: string, data: Partial<{ number: string; label: string; order: number }>) {
  await connectDB();
  const stat = await Stat.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(stat));
}

export async function deleteStat(id: string) {
  await connectDB();
  await Stat.findByIdAndDelete(id);
  revalidatePath("/");
}
