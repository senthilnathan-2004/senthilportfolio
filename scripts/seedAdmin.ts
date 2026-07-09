/**
 * One-time admin seed script.
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seedAdmin.ts
 *
 * Requirements: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD in .env.local
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "portfolio_db";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set in .env.local");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log("✅ Connected");

  // Dynamically import models to avoid registration conflicts
  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  // Check if admin exists
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`⚠️  Admin user already exists: ${ADMIN_EMAIL}`);
    console.log("   To reset password, use the admin panel Change Password form.");
    await mongoose.disconnect();
    return;
  }

  // Create admin
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({ email: ADMIN_EMAIL.toLowerCase(), passwordHash });
  console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);

  // Seed default SiteSettings
  const SiteSettingsSchema = new mongoose.Schema({
    logoText: String,
    navLinks: Array,
    ctaText: String,
    ctaHref: String,
    footerText: String,
    footerQuickLinks: Array,
    socialLinks: Array,
  }, { timestamps: true });
  const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

  const settingsExists = await SiteSettings.findOne();
  if (!settingsExists) {
    await SiteSettings.create({
      logoText: "// DevSync",
      navLinks: [
        { label: "About", href: "#about", order: 0 },
        { label: "Projects", href: "#projects", order: 1 },
        { label: "Contact", href: "#contact", order: 2 },
      ],
      ctaText: "Let's Collaborate",
      ctaHref: "#contact",
      footerText: "© {year} DevSync. All rights reserved.",
      footerQuickLinks: [
        { label: "About", href: "#about", order: 0 },
        { label: "Projects", href: "#projects", order: 1 },
        { label: "Contact", href: "#contact", order: 2 },
      ],
      socialLinks: [
        { platform: "Instagram", url: "#", order: 0 },
        { platform: "Twitter (X)", url: "#", order: 1 },
        { platform: "LinkedIn", url: "#", order: 2 },
        { platform: "GitHub", url: "#", order: 3 },
      ],
    });
    console.log("✅ Default SiteSettings created");
  }

  // Seed default Hero
  const HeroSchema = new mongoose.Schema({
    badgeText: String, headline: String,
    portraitImageUrl: String, portraitImageFileId: String,
    portraitAlt: String, captionName: String, socialLinks: Array,
  }, { timestamps: true });
  const Hero = mongoose.models.Hero || mongoose.model("Hero", HeroSchema);

  const heroExists = await Hero.findOne();
  if (!heroExists) {
    await Hero.create({
      badgeText: "<6+ Year Experience>",
      headline: "BUILDING FAST,\nSCALABLE, AND\nSECURE WEBSITE",
      portraitImageUrl: "",
      portraitImageFileId: "",
      portraitAlt: "Developer portrait",
      captionName: "Alex Rivera",
      socialLinks: [
        { platform: "Instagram", url: "#", order: 0 },
        { platform: "Twitter (X)", url: "#", order: 1 },
        { platform: "LinkedIn", url: "#", order: 2 },
        { platform: "GitHub", url: "#", order: 3 },
      ],
    });
    console.log("✅ Default Hero created");
  }

  // Seed default Stats
  const StatSchema = new mongoose.Schema({
    number: String, label: String, order: Number
  }, { timestamps: true });
  const Stat = mongoose.models.Stat || mongoose.model("Stat", StatSchema);

  const statsExist = await Stat.findOne();
  if (!statsExist) {
    await Stat.insertMany([
      { number: "97", label: "Completed\nProjects", order: 0 },
      { number: "6+", label: "Years in\nDevelopment", order: 1 },
      { number: "17+", label: "Clients\nWorldwide", order: 2 },
      { number: "10,000+", label: "Users on My Built\nPlatforms", order: 3 },
    ]);
    console.log("✅ Default Stats created");
  }

  // Seed default About
  const AboutSchema = new mongoose.Schema({
    tagLabel: String, bioRichText: String,
    cvUrl: String, cvFileId: String, imageUrl: String, imageFileId: String, imageAlt: String,
  }, { timestamps: true });
  const About = mongoose.models.About || mongoose.model("About", AboutSchema);

  const aboutExists = await About.findOne();
  if (!aboutExists) {
    await About.create({
      tagLabel: "<About>",
      bioRichText: "<p>I'm a developer &amp; UI designer, crafting seamless, modern digital experiences with clean code and thoughtful design. I specialize in building fast, scalable, and secure web applications that users love.</p>",
      cvUrl: "", cvFileId: "", imageUrl: "", imageFileId: "",
      imageAlt: "About photo",
    });
    console.log("✅ Default About created");
  }

  // Seed default Skills
  const SkillSchema = new mongoose.Schema({
    name: String, iconUrl: String, iconFileId: String, level: Number, order: Number,
  }, { timestamps: true });
  const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

  const skillsExist = await Skill.findOne();
  if (!skillsExist) {
    await Skill.insertMany([
      { name: "React", iconUrl: "", level: 95, order: 0 },
      { name: "Next.js", iconUrl: "", level: 92, order: 1 },
      { name: "TypeScript", iconUrl: "", level: 88, order: 2 },
      { name: "Node.js", iconUrl: "", level: 85, order: 3 },
      { name: "MongoDB", iconUrl: "", level: 80, order: 4 },
      { name: "Tailwind CSS", iconUrl: "", level: 95, order: 5 },
      { name: "Figma", iconUrl: "", level: 82, order: 6 },
      { name: "AWS", iconUrl: "", level: 75, order: 7 },
    ]);
    console.log("✅ Default Skills created");
  }

  await mongoose.disconnect();
  console.log("\n🎉 Seed complete! You can now log in at /admin/login");
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: [the value of ADMIN_PASSWORD in .env.local]`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
