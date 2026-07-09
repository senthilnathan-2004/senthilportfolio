"use server";

import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import Service from "@/models/Service";
import { revalidatePath } from "next/cache";

// --- Testimonials ---
export async function getTestimonials() {
  await connectDB();
  const items = await Testimonial.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export async function createTestimonial(data: { name: string; role?: string; company?: string; avatarUrl?: string; avatarFileId?: string; quote: string; rating?: number }) {
  await connectDB();
  const count = await Testimonial.countDocuments();
  const item = await Testimonial.create({ ...data, order: count });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(item));
}

export async function updateTestimonial(id: string, data: Partial<{ name: string; role: string; company: string; avatarUrl: string; avatarFileId: string; quote: string; rating: number; order: number; isApproved: boolean }>) {
  await connectDB();
  const item = await Testimonial.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(item));
}

export async function deleteTestimonial(id: string) {
  await connectDB();
  await Testimonial.findByIdAndDelete(id);
  revalidatePath("/");
}

// --- Services ---
export async function getServices() {
  await connectDB();
  const items = await Service.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export async function createService(data: { icon?: string; title: string; description?: string }) {
  await connectDB();
  const count = await Service.countDocuments();
  const item = await Service.create({ ...data, order: count });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(item));
}

export async function updateService(id: string, data: Partial<{ icon: string; title: string; description: string; order: number }>) {
  await connectDB();
  const item = await Service.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(item));
}

export async function deleteService(id: string) {
  await connectDB();
  await Service.findByIdAndDelete(id);
  revalidatePath("/");
}
