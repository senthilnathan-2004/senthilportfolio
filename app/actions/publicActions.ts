"use server";

import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { revalidatePath } from "next/cache";

export async function getPublicTestimonials() {
  await connectDB();
  const items = await Testimonial.find({ isApproved: true }).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export async function submitPublicTestimonial(data: { name: string; role: string; quote: string; rating: number }) {
  await connectDB();
  
  // Create a new testimonial. isApproved defaults to false via Mongoose schema.
  const count = await Testimonial.countDocuments();
  const item = await Testimonial.create({ 
    ...data, 
    order: count,
    isApproved: false 
  });
  
  revalidatePath("/admin/testimonials");
  return { success: true, message: "Testimonial submitted successfully and is pending approval." };
}
