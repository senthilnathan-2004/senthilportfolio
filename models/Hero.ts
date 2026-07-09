import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHero extends Document {
  badgeText: string;
  headline: string;
  portraitImageUrl: string;
  portraitImageFileId: string;
  portraitAlt: string;
  captionName: string;
  socialLinks: Array<{
    platform: string;
    url: string;
    order: number;
  }>;
}

const HeroSchema = new Schema<IHero>(
  {
    badgeText: { type: String, default: "<6+ Year Experience>" },
    headline: {
      type: String,
      default: "BUILDING FAST,\nSCALABLE, AND\nSECURE WEBSITE",
    },
    portraitImageUrl: { type: String, default: "" },
    portraitImageFileId: { type: String, default: "" },
    portraitAlt: { type: String, default: "Developer portrait" },
    captionName: { type: String, default: "Alex Rivera" },
    socialLinks: [
      {
        platform: String,
        url: String,
        order: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Hero: Model<IHero> =
  mongoose.models.Hero || mongoose.model<IHero>("Hero", HeroSchema);

export default Hero;
