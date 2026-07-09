import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryItem {
  url: string;
  fileId: string;
  alt: string;
  order: number;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  coverImageUrl: string;
  coverImageFileId: string;
  coverImageAlt: string;
  gallery: IGalleryItem[];
  shortDescription: string;
  caseStudyRichText: string;
  techTags: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  featured: boolean;
  order: number;
}

const GalleryItemSchema = new Schema<IGalleryItem>({
  url: String,
  fileId: String,
  alt: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImageUrl: { type: String, default: "" },
    coverImageFileId: { type: String, default: "" },
    coverImageAlt: { type: String, default: "" },
    gallery: [GalleryItemSchema],
    shortDescription: { type: String, default: "" },
    caseStudyRichText: { type: String, default: "" },
    techTags: [{ type: String }],
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    category: { type: String, default: "Web Development" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
