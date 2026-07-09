import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import Hero from "../models/Hero";
import About from "../models/About";
import Project from "../models/Project";
import Skill from "../models/Skill";
import Stat from "../models/Stat";
import Testimonial from "../models/Testimonial";
import Service from "../models/Service";
import SiteSettings from "../models/SiteSettings";

async function seedMockData() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB_NAME || "portfolio_db";

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName });
    console.log("Connected to MongoDB:", dbName);

    // Clear existing data (optional, but good for a fresh seed)
    await Promise.all([
      Hero.deleteMany({}),
      About.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Stat.deleteMany({}),
      Testimonial.deleteMany({}),
      Service.deleteMany({}),
      SiteSettings.deleteMany({}),
    ]);

    console.log("Cleared existing collections.");

    // Seed Hero
    await Hero.create({
      badgeText: "<6+ Years Experience>",
      headline: "BUILDING FAST,\nSCALABLE, AND\nSECURE WEBSITES",
      portraitImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
      captionName: "Alex Rivera",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com", order: 1 },
        { platform: "LinkedIn", url: "https://linkedin.com", order: 2 },
        { platform: "Twitter", url: "https://twitter.com", order: 3 },
      ],
    });

    // Seed About
    await About.create({
      tagLabel: "<About>",
      bioRichText: "<p>I'm a full-stack developer with a passion for creating beautiful, performant applications. Specializing in modern web technologies, I bridge the gap between design and engineering to build scalable digital experiences.</p><p>When I'm not coding, you can find me exploring new UI trends or contributing to open-source projects.</p>",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Workspace",
    });

    // Seed Projects
    await Project.insertMany([
      {
        title: "E-Commerce Platform",
        slug: "e-commerce-platform",
        coverImageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A high-performance modern e-commerce storefront with real-time inventory and seamless checkout.",
        caseStudyRichText: "<p>Detailed case study goes here.</p>",
        techTags: ["Next.js", "MongoDB", "Tailwind CSS", "Stripe"],
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        category: "Full-Stack",
        featured: true,
        order: 1,
      },
      {
        title: "Fintech Dashboard",
        slug: "fintech-dashboard",
        coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        shortDescription: "An interactive dashboard for tracking crypto and stock portfolios with real-time charts.",
        caseStudyRichText: "<p>Detailed case study goes here.</p>",
        techTags: ["React", "Framer Motion", "Recharts"],
        liveUrl: "https://example.com",
        category: "UI/UX",
        featured: true,
        order: 2,
      },
      {
        title: "AI Writing Assistant",
        slug: "ai-writing-assistant",
        coverImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A rich text editor powered by generative AI to help writers overcome block.",
        caseStudyRichText: "<p>Detailed case study goes here.</p>",
        techTags: ["OpenAI", "TipTap", "TypeScript"],
        githubUrl: "https://github.com",
        category: "AI",
        featured: false,
        order: 3,
      }
    ]);

    // Seed Skills
    await Skill.insertMany([
      { name: "React", level: 95, order: 1 },
      { name: "Next.js", level: 90, order: 2 },
      { name: "TypeScript", level: 85, order: 3 },
      { name: "Node.js", level: 80, order: 4 },
      { name: "MongoDB", level: 75, order: 5 },
      { name: "Tailwind CSS", level: 95, order: 6 },
    ]);

    // Seed Stats
    await Stat.insertMany([
      { number: "40+", label: "Projects Completed", order: 1 },
      { number: "5+", label: "Years Experience", order: 2 },
      { number: "100%", label: "Client Satisfaction", order: 3 },
    ]);

    // Seed Testimonials
    await Testimonial.insertMany([
      {
        name: "Sarah Jenkins",
        role: "CEO",
        company: "TechFlow",
        quote: "Alex is an incredible developer. Delivered our project ahead of schedule and the code quality was exceptional.",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        order: 1,
      },
      {
        name: "David Chen",
        role: "Product Manager",
        company: "Innovate Inc",
        quote: "Working with Alex was a breeze. They have a great eye for design and deeply understand modern frontend architecture.",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        order: 2,
      }
    ]);

    // Seed Services
    await Service.insertMany([
      { title: "Frontend Development", icon: "Layout", description: "Building responsive, accessible, and performant user interfaces with React and Next.js.", order: 1 },
      { title: "Backend Systems", icon: "Server", description: "Designing scalable REST APIs and secure database architectures.", order: 2 },
      { title: "UI/UX Design", icon: "Palette", description: "Crafting beautiful, intuitive design systems and prototyping user journeys.", order: 3 },
    ]);

    // Seed Settings
    await SiteSettings.create({
      logoText: "// DevSync",
      navLinks: [
        { label: "Work", href: "#work", order: 1 },
        { label: "About", href: "#about", order: 2 },
        { label: "Services", href: "#services", order: 3 },
      ],
      ctaText: "Let's Talk",
      ctaHref: "#contact",
      footerText: "© 2026 DevSync. All rights reserved.",
      footerQuickLinks: [
        { label: "Home", href: "#", order: 1 },
        { label: "Admin Login", href: "/admin/login", order: 2 },
      ],
      socialLinks: [
        { platform: "GitHub", url: "https://github.com", order: 1 },
        { platform: "Twitter", url: "https://twitter.com", order: 2 },
      ],
    });

    console.log("Successfully seeded mock data!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seedMockData();
