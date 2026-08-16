"use server";

import connectDB from "@/lib/db";
import AuditProof from "@/models/AuditProof";
import { revalidatePath } from "next/cache";

export async function getPublicAudits() {
  await connectDB();
  const audits = await AuditProof.find({ featured: true }).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(audits));
}

export async function getAdminAudits() {
  await connectDB();
  const audits = await AuditProof.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(audits));
}

export async function createAudit(data: {
  title: string;
  category?: "Security" | "Performance" | "SEO" | "Ranking";
  badgeText?: string;
  scoreOrMetric?: string;
  description?: string;
  imageUrl?: string;
  imageFileId?: string;
  imageAlt?: string;
  pdfUrl?: string;
  externalLink?: string;
  featured?: boolean;
}) {
  await connectDB();
  const count = await AuditProof.countDocuments();
  const audit = await AuditProof.create({
    ...data,
    order: count,
  });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(audit));
}

export async function updateAudit(
  id: string,
  data: Partial<{
    title: string;
    category: "Security" | "Performance" | "SEO" | "Ranking";
    badgeText: string;
    scoreOrMetric: string;
    description: string;
    imageUrl: string;
    imageFileId: string;
    imageAlt: string;
    pdfUrl: string;
    externalLink: string;
    featured: boolean;
    order: number;
  }>
) {
  await connectDB();
  const audit = await AuditProof.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/");
  return JSON.parse(JSON.stringify(audit));
}

export async function deleteAudit(id: string) {
  await connectDB();
  await AuditProof.findByIdAndDelete(id);
  revalidatePath("/");
}

export async function reorderAudits(ids: string[]) {
  await connectDB();
  await Promise.all(
    ids.map((id, index) => AuditProof.findByIdAndUpdate(id, { order: index }))
  );
  revalidatePath("/");
}
