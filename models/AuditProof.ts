import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditProof extends Document {
  title: string;
  category: "Security" | "Performance" | "SEO" | "Ranking";
  badgeText: string;
  scoreOrMetric: string;
  description: string;
  imageUrl: string;
  imageFileId: string;
  imageAlt: string;
  pdfUrl?: string;
  externalLink?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AuditProofSchema = new Schema<IAuditProof>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Security", "Performance", "SEO", "Ranking"],
      default: "Performance",
    },
    badgeText: { type: String, default: "Verified" },
    scoreOrMetric: { type: String, default: "100%" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imageFileId: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    pdfUrl: { type: String, default: "" },
    externalLink: { type: String, default: "" },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AuditProof: Model<IAuditProof> =
  mongoose.models.AuditProof ||
  mongoose.model<IAuditProof>("AuditProof", AuditProofSchema);

export default AuditProof;
