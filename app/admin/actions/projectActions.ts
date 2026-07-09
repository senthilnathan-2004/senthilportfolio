"use server";

import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils";

export async function getProjects() {
  await connectDB();
  const projects = await Project.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(projects));
}

export async function getProjectBySlug(slug: string) {
  await connectDB();
  const project = await Project.findOne({ slug }).lean();
  return JSON.parse(JSON.stringify(project));
}

export async function getProjectById(id: string) {
  await connectDB();
  const project = await Project.findById(id).lean();
  return JSON.parse(JSON.stringify(project));
}

export async function createProject(data: {
  title: string;
  shortDescription?: string;
  category?: string;
  featured?: boolean;
}) {
  await connectDB();
  const slug = generateSlug(data.title);
  // Ensure unique slug
  let finalSlug = slug;
  let counter = 1;
  while (await Project.findOne({ slug: finalSlug })) {
    finalSlug = `${slug}-${counter++}`;
  }
  const project = await Project.create({ ...data, slug: finalSlug, order: await Project.countDocuments() });
  revalidatePath("/");
  revalidatePath("/projects/[slug]");
  return JSON.parse(JSON.stringify(project));
}

export async function updateProject(id: string, data: Partial<{
  title: string; slug: string; coverImageUrl: string; coverImageFileId: string;
  coverImageAlt: string; gallery: Array<{ url: string; fileId: string; alt: string; order: number }>;
  shortDescription: string; caseStudyRichText: string; techTags: string[];
  liveUrl: string; githubUrl: string; category: string; featured: boolean; order: number;
}>) {
  await connectDB();
  // Regenerate slug if title changed
  if (data.title && !data.slug) {
    data.slug = generateSlug(data.title);
  }
  const project = await Project.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/");
  revalidatePath(`/projects/${project?.slug}`);
  return JSON.parse(JSON.stringify(project));
}

export async function deleteProject(id: string) {
  await connectDB();
  await Project.findByIdAndDelete(id);
  revalidatePath("/");
}

export async function reorderProjects(ids: string[]) {
  await connectDB();
  await Promise.all(ids.map((id, index) => Project.findByIdAndUpdate(id, { order: index })));
  revalidatePath("/");
}
