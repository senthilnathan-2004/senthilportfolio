import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
  tagLabel: string;
  bioRichText: string;
  cvUrl: string;
  cvFileId: string;
  imageUrl: string;
  imageFileId: string;
  imageAlt: string;
}

const AboutSchema = new Schema<IAbout>(
  {
    tagLabel: { type: String, default: "<About>" },
    bioRichText: {
      type: String,
      default:
        "<p>I'm a developer & UI designer, crafting seamless, modern digital experiences.</p>",
    },
    cvUrl: { type: String, default: "" },
    cvFileId: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imageFileId: { type: String, default: "" },
    imageAlt: { type: String, default: "About photo" },
  },
  { timestamps: true }
);

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
