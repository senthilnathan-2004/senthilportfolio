import mongoose, { Schema, Document, Model } from "mongoose";

export interface INavLink {
  label: string;
  href: string;
  order: number;
}

export interface ISiteSettings extends Document {
  logoText: string;
  navLinks: INavLink[];
  ctaText: string;
  ctaHref: string;
  footerText: string;
  footerQuickLinks: INavLink[];
  socialLinks: Array<{
    platform: string;
    url: string;
    order: number;
  }>;
  contactEmail: string;
  contactLocation: string;
  faviconUrl: string;
  faviconFileId: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    logoText: { type: String, default: "// Senthilragu" },
    navLinks: [
      {
        label: String,
        href: String,
        order: { type: Number, default: 0 },
      },
    ],
    ctaText: { type: String, default: "Let's Collaborate" },
    ctaHref: { type: String, default: "#contact" },
    footerText: {
      type: String,
      default: "© {year} Senthilragu. All rights reserved.",
    },
    footerQuickLinks: [{ label: String, href: String, order: Number }],
    socialLinks: [
      {
        platform: String,
        url: String,
        order: { type: Number, default: 0 },
      },
    ],
    contactEmail: { type: String, default: "hello@example.com" },
    contactLocation: { type: String, default: "Earth, Local Cluster" },
    faviconUrl: { type: String, default: "" },
    faviconFileId: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models.SiteSettings) {
  delete mongoose.models.SiteSettings;
}

const SiteSettings: Model<ISiteSettings> = mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
