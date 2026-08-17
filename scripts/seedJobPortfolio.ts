import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import Hero from "../models/Hero";
import About from "../models/About";
import Project from "../models/Project";
import Skill from "../models/Skill";
import Stat from "../models/Stat";
import SiteSettings from "../models/SiteSettings";
import User from "../models/User";
import Service from "../models/Service";
import Testimonial from "../models/Testimonial";

async function seedJobPortfolio() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ Missing MONGODB_URI in environment variables");
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB_NAME || "portfolio";

  try {
    console.log("🌱 Connecting to MongoDB database:", dbName);
    await mongoose.connect(uri, { dbName });
    console.log("✅ Successfully connected to MongoDB!");

    // Clear old/freelance data
    await Promise.all([
      Hero.deleteMany({}),
      About.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Stat.deleteMany({}),
      SiteSettings.deleteMany({}),
      Service.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);
    console.log("🧹 Cleared old collections (including services & testimonials).");

    // 1. Admin User
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || "senthilragunathan2004@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || "Senthil@123";
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await User.findOneAndUpdate(
      { email: adminEmail.toLowerCase() },
      { email: adminEmail.toLowerCase(), passwordHash },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`✅ Admin user seeded: ${adminEmail}`);

    // 2. Hero Section
    await Hero.create({
      badgeText: "<Available for Full-Time Roles>",
      headline: "FULL STACK\nMERN DEVELOPER\nBUILDING SCALABLE APPS",
      portraitImageUrl: "https://images.unsplash.com/photo-1534972195531-a756b1146275?q=80&w=800&auto=format&fit=crop",
      portraitAlt: "Senthilnathan R portrait",
      captionName: "Senthilnathan R",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/senthilnathan-2004", order: 1 },
        { platform: "LinkedIn", url: "https://linkedin.com/in/senthilnathan-r", order: 2 },
        { platform: "Portfolio", url: "https://senthilnathan-2004.github.io/sen_pro", order: 3 },
      ],
    });
    console.log("✅ Hero section seeded.");

    // 3. About Section
    await About.create({
      tagLabel: "<Software Engineer>",
      bioRichText: `
<p><strong>Full Stack MERN Developer</strong> with hands-on experience building scalable web applications, robust RESTful APIs, and reusable UI component systems.</p>
<p>Proficient in <strong>React.js, Node.js, Express.js, MongoDB, TypeScript, and modern JavaScript (ES6+)</strong> with a strong focus on performance optimization, web security, and developer productivity tools.</p>
<p><strong>Education:</strong> Anand Institute of Higher Technology, Chennai (2022–2026) — <em>Bachelor of Engineering in Computer Science and Engineering</em> (CGPA: 8.2 / 10).</p>
<p><strong>Certifications:</strong> MongoDB for Developers (MongoDB University) &amp; Idea Presentation (College Innovation Event).</p>
      `.trim(),
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Coding & Development Workspace",
      cvUrl: "https://senthilnathan-2004.github.io/sen_pro",
    });
    console.log("✅ About section seeded.");

    // 4. Stats Section (Job Hunter Metrics)
    await Stat.insertMany([
      { number: "8.2", label: "CGPA in B.E. CSE\n(2022–2026)", order: 1 },
      { number: "MERN", label: "Stack Core\nSpecialization", order: 2 },
      { number: "9+", label: "Production-Grade\nFull-Stack Projects", order: 3 },
      { number: "100%", label: "Committed to Scalable\n& Clean Code", order: 4 },
    ]);
    console.log("✅ Stats section seeded.");

    // 5. Skills (Grouped with Categories)
    await Skill.insertMany([
      // Frontend
      { name: "React.js", category: "Frontend", level: 95, order: 1 },
      { name: "Redux", category: "Frontend", level: 88, order: 2 },
      { name: "Next.js", category: "Frontend", level: 92, order: 3 },
      { name: "Tailwind CSS", category: "Frontend", level: 95, order: 4 },
      { name: "HTML5 / CSS3", category: "Frontend", level: 95, order: 5 },
      { name: "Three.js / 3D UI", category: "Frontend", level: 80, order: 6 },
      { name: "Responsive Design", category: "Frontend", level: 90, order: 7 },

      // Backend
      { name: "Node.js", category: "Backend", level: 92, order: 8 },
      { name: "Express.js", category: "Backend", level: 90, order: 9 },
      { name: "REST API Design", category: "Backend", level: 94, order: 10 },
      { name: "JWT Authentication", category: "Backend", level: 90, order: 11 },
      { name: "RBAC & Security", category: "Backend", level: 88, order: 12 },
      { name: "Socket.io", category: "Backend", level: 82, order: 13 },

      // Languages
      { name: "JavaScript (ES6+)", category: "Languages", level: 95, order: 14 },
      { name: "TypeScript", category: "Languages", level: 90, order: 15 },
      { name: "Python", category: "Languages", level: 80, order: 16 },
      { name: "SQL", category: "Languages", level: 82, order: 17 },

      // Databases & Tools
      { name: "MongoDB", category: "Databases & Tools", level: 92, order: 18 },
      { name: "MySQL", category: "Databases & Tools", level: 82, order: 19 },
      { name: "Git & GitHub", category: "Databases & Tools", level: 92, order: 20 },
      { name: "Docker", category: "Databases & Tools", level: 78, order: 21 },
      { name: "Postman", category: "Databases & Tools", level: 90, order: 22 },
      { name: "Electron", category: "Databases & Tools", level: 80, order: 23 },
      { name: "CI/CD", category: "Databases & Tools", level: 80, order: 24 },
    ]);
    console.log("✅ Skills section seeded.");

    // 6. Complete Portfolio Projects (9+ Projects)
    await Project.insertMany([
      {
        title: "Desktop Hospital Management System",
        slug: "desktop-hospital-management-system",
        coverImageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A production-ready Hospital Management System built with Electron and Next.js, covering patients, doctors, billing, inventory, and reporting with role-based access control.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p>A high-performance, production-ready desktop and web enterprise application designed for clinical hospital management and medical workflows.</p>
<h3>Key Capabilities &amp; Architecture:</h3>
<ul>
  <li><strong>Comprehensive Modules:</strong> Covers patient registration, doctor schedules, electronic prescriptions, pharmacy inventory, and automated invoice billing.</li>
  <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions separating Doctor, Receptionist, Pharmacist, and Admin roles.</li>
  <li><strong>Hybrid Tech Stack:</strong> Packaged as a desktop application using <strong>Electron</strong> and accelerated with <strong>Next.js, MongoDB, and Tailwind CSS</strong>.</li>
  <li><strong>Offline Resilience:</strong> Engineered to provide reliable performance even during network latency or temporary disconnections.</li>
</ul>
        `.trim(),
        techTags: ["Next.js", "MongoDB", "Tailwind CSS", "Desktop Application", "Electron"],
        githubUrl: "https://github.com/senthilnathan-2004",
        liveUrl: "https://senthilragu.vercel.app/projects/desktop-hospital-management-system",
        category: "Full Stack",
        featured: true,
        order: 1,
      },
      {
        title: "Full-Stack Website & Booking System",
        slug: "full-stack-website-booking-system",
        coverImageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A scalable full-stack website for a physiotherapy clinic in Bengaluru, featuring real-time appointment booking, therapist selection, and an admin dashboard built to solve discovery and booking in one system.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p>End-to-end booking and patient engagement platform built for a premier physiotherapy clinic in Bengaluru.</p>
<h3>Key Features:</h3>
<ul>
  <li><strong>Real-Time Appointment Scheduling:</strong> Integrated calendar sync with therapist availability and automated slot validation.</li>
  <li><strong>Therapist Selection:</strong> Patients can filter and select specialized practitioners based on treatments and availability.</li>
  <li><strong>Admin CMS Dashboard:</strong> Centralized dashboard giving staff real-time visibility into bookings, therapist schedules, and customer inquiries.</li>
  <li><strong>Tech Stack:</strong> Built using <strong>Next.js, TypeScript, MongoDB, and Tailwind CSS</strong>.</li>
</ul>
        `.trim(),
        techTags: ["Next.js", "MongoDB", "TypeScript", "Appointment Scheduling", "Tailwind CSS"],
        githubUrl: "https://github.com/senthilnathan-2004",
        liveUrl: "https://senthilragu.vercel.app/projects/full-stack-website-booking-system",
        category: "Full Stack",
        featured: true,
        order: 2,
      },
      {
        title: "Modern Gym & Fitness Landing Page",
        slug: "modern-gym-fitness-landing-page",
        coverImageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A modern, high-conversion fitness landing page built with a scalable React.js component architecture, featuring smooth animations and a polished UI/UX across every device.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p>High-conversion modern fitness landing page designed to maximize member acquisition and showcase athletic programs.</p>
<h3>Key Features:</h3>
<ul>
  <li><strong>Fluid Component Architecture:</strong> Scalable React.js component library with reusable modular UI primitives.</li>
  <li><strong>Micro-Animations:</strong> Smooth interactive scroll triggers, hover states, and engaging hero counters.</li>
  <li><strong>Responsive Layouts:</strong> Pixel-perfect responsive design tailored for mobile, tablet, and widescreen monitors.</li>
</ul>
        `.trim(),
        techTags: ["React", "Tailwind CSS", "UX & UI Design", "Responsive Design"],
        githubUrl: "https://github.com/senthilnathan-2004",
        liveUrl: "https://senthilragu.vercel.app/projects/modern-gym-fitness-landing-page",
        category: "Frontend",
        featured: true,
        order: 3,
      },
      {
        title: "Premium Hypercar Landing Page",
        slug: "premium-hypercar-landing-page",
        coverImageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A cinematic, high-performance showroom website for luxury auto brands, featuring immersive 3D vehicle interactions built with React Three Fiber, Framer Motion, and GSAP ScrollTrigger.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p>A visually stunning, cinematic 3D digital showroom experience for luxury and high-performance automotive vehicles.</p>
<h3>Key Highlights:</h3>
<ul>
  <li><strong>3D Real-time Visualizer:</strong> Interactive 3D vehicle model viewer with custom shaders and camera orbit controls powered by <strong>Three.js / React Three Fiber</strong>.</li>
  <li><strong>Cinematic Animations:</strong> Scroll-driven choreography with <strong>GSAP ScrollTrigger and Framer Motion</strong>.</li>
  <li><strong>Optimized Asset Loading:</strong> Progressive model decimation and LOD techniques ensuring fast load times.</li>
</ul>
        `.trim(),
        techTags: ["Next.js", "React", "Three.js", "TypeScript", "Framer Motion"],
        githubUrl: "https://github.com/senthilnathan-2004",
        liveUrl: "https://senthilragu.vercel.app/projects/premium-hypercar-landing-page",
        category: "Frontend",
        featured: true,
        order: 4,
      },
      {
        title: "Healthcare Admin Dashboard & Appointment System",
        slug: "healthcare-admin-dashboard-appointment-system",
        coverImageUrl: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A custom admin dashboard built on a scalable architecture, giving non-technical clinic staff full control over appointments, content, and inquiries with zero developer support needed.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p>A custom-tailored clinic operations and management dashboard designed for medical administration teams.</p>
<h3>Key Highlights:</h3>
<ul>
  <li><strong>Zero-Dependency Operations:</strong> Allows front-desk staff to manage appointments, update practitioner schedules, and publish content independently.</li>
  <li><strong>Real-Time Querying:</strong> Fast, indexed MongoDB queries with optimistic UI updates in React.</li>
  <li><strong>Data Analytics:</strong> Visualizes appointment volume, patient return rates, and department capacity.</li>
</ul>
        `.trim(),
        techTags: ["Next.js", "React", "TypeScript", "MongoDB", "Node.js"],
        githubUrl: "https://github.com/senthilnathan-2004",
        liveUrl: "https://senthilragu.vercel.app/projects/healthcare-admin-dashboard-appointment-system",
        category: "Full Stack",
        featured: true,
        order: 5,
      },
      {
        title: "Rotaract Club Management System",
        slug: "rotaract-club-management-system",
        coverImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A secure, centralized ERP platform replacing scattered spreadsheets for college Rotaract clubs featuring RBAC, 2FA, and automated financial reporting with full audit trails.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p>An enterprise-grade club management ERP platform created to organize club members, initiatives, events, and dues.</p>
<h3>Key Highlights:</h3>
<ul>
  <li><strong>Secure Authentication:</strong> Role-based access control (RBAC) augmented with Two-Factor Authentication (2FA).</li>
  <li><strong>Financial Accounting:</strong> Automated tracking of club dues, event expenses, and downloadable PDF financial balance sheets.</li>
  <li><strong>Audit Trails:</strong> Comprehensive audit logs for every admin and executive action.</li>
</ul>
        `.trim(),
        techTags: ["React", "Node.js", "Express.js", "MongoDB", "RBAC", "2FA"],
        githubUrl: "https://github.com/senthilnathan-2004",
        liveUrl: "https://senthilragu.vercel.app/projects/rotaract-club-management-system",
        category: "Full Stack",
        featured: true,
        order: 6,
      },
      {
        title: "Premium Real Estate Landing Page",
        slug: "premium-real-estate-landing-page",
        coverImageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A high-conversion real estate landing page built with Next.js and React, featuring interactive property galleries, lead-capture workflows, and premium Framer Motion/GSAP animations.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p>An ultra-luxurious digital storefront for high-end luxury architectural properties and residential estates.</p>
<h3>Key Highlights:</h3>
<ul>
  <li><strong>Interactive Gallery:</strong> Filterable property showcase with multi-angle high-res galleries and virtual previews.</li>
  <li><strong>Lead Capture Funnel:</strong> Smart inquiry forms connected directly to CRM webhooks.</li>
  <li><strong>Framer Motion &amp; GSAP:</strong> Fluid parallax scroll transitions and smooth micro-interactions.</li>
</ul>
        `.trim(),
        techTags: ["Next.js", "React", "Three.js", "Tailwind CSS", "Framer Motion"],
        githubUrl: "https://github.com/senthilnathan-2004",
        liveUrl: "https://senthilragu.vercel.app/projects/premium-real-estate-landing-page",
        category: "Frontend",
        featured: true,
        order: 7,
      },
      {
        title: "Full-Stack E-Commerce Platform for Meat Shops",
        slug: "full-stack-e-commerce-platform-for-meat-shops",
        coverImageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A full-stack e-commerce platform pairing a seamless storefront with a centralized admin dashboard, featuring real-time inventory, live pricing, and secure order tracking.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p>End-to-end commercial food delivery and meat shop e-commerce platform built with the MERN stack.</p>
<h3>Key Highlights:</h3>
<ul>
  <li><strong>Full Commerce Workflow:</strong> Product catalog filtering, persistent shopping cart in Local Storage, and order tracking.</li>
  <li><strong>JWT Authentication:</strong> Secure password hashing and protected customer checkout routes.</li>
  <li><strong>RESTful API Design:</strong> Clean backend API architecture built with Node.js and Express.js.</li>
</ul>
        `.trim(),
        techTags: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "REST API"],
        githubUrl: "https://github.com/senthilnathan-2004/meatshop",
        liveUrl: "https://github.com/senthilnathan-2004/meatshop",
        category: "Full Stack",
        featured: true,
        order: 8,
      },
      {
        title: "ComponentHub – Reusable UI Component Platform",
        slug: "component-hub",
        coverImageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
        shortDescription: "Engineered a dynamic rendering engine using React state management enabling live component previews and real-time style customization.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p><strong>ComponentHub</strong> is a full-stack platform built with the MERN stack designed to accelerate frontend engineering workflows.</p>
<h3>Key Highlights:</h3>
<ul>
  <li><strong>Live Preview Engine:</strong> Dynamic rendering engine enabling live component previews and real-time customization.</li>
  <li><strong>Automated Code Export:</strong> Instant code copy and export for production-ready responsive snippets.</li>
  <li><strong>Component Architecture:</strong> Built using React, Tailwind CSS, Node.js, and MongoDB.</li>
</ul>
        `.trim(),
        techTags: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "MERN Stack"],
        githubUrl: "https://github.com/senthilnathan-2004/ComponentHub",
        liveUrl: "https://github.com/senthilnathan-2004/ComponentHub",
        category: "Full Stack",
        featured: true,
        order: 9,
      },
      {
        title: "Website & Appointment Management System",
        slug: "website-appointment-management-system",
        coverImageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop",
        shortDescription: "A modern clinic website with online appointment booking, service management, patient engagement features, and an admin dashboard for managing clinic operations.",
        caseStudyRichText: `
<h3>Project Overview</h3>
<p>Integrated online appointment booking system and digital patient engagement portal.</p>
<h3>Key Highlights:</h3>
<ul>
  <li><strong>Online Booking:</strong> Self-service patient scheduling with real-time slot selection.</li>
  <li><strong>Clinic Operations:</strong> Admin portal to manage service catalog, doctor schedules, and patient inquiries.</li>
  <li><strong>Responsive Interface:</strong> Optimized with Tailwind CSS, TypeScript, and Node.js backend.</li>
</ul>
        `.trim(),
        techTags: ["Tailwind CSS", "Node.js", "MongoDB", "TypeScript", "React"],
        githubUrl: "https://github.com/senthilnathan-2004",
        liveUrl: "https://senthilragu.vercel.app/projects/new-project",
        category: "Web Development",
        featured: true,
        order: 10,
      },
    ]);
    console.log("✅ 10 Projects successfully seeded.");

    // 7. Site Settings
    await SiteSettings.create({
      logoText: "// Senthilnathan R",
      navLinks: [
        { label: "Home", href: "/", order: 1 },
        { label: "About", href: "/about", order: 2 },
        { label: "Skills", href: "/skills", order: 3 },
        { label: "Projects", href: "/projects", order: 4 },
        { label: "Contact", href: "/contact", order: 5 },
      ],
      ctaText: "Get in Touch",
      ctaHref: "/contact",
      footerText: "© {year} Senthilnathan R. All rights reserved.",
      footerQuickLinks: [
        { label: "Home", href: "/", order: 1 },
        { label: "About", href: "/about", order: 2 },
        { label: "Skills", href: "/skills", order: 3 },
        { label: "Projects", href: "/projects", order: 4 },
        { label: "Contact", href: "/contact", order: 5 },
      ],
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/senthilnathan-2004", order: 1 },
        { platform: "LinkedIn", url: "https://linkedin.com/in/senthilnathan-r", order: 2 },
        { platform: "Portfolio", url: "https://senthilnathan-2004.github.io/sen_pro", order: 3 },
      ],
      contactEmail: "senthilragunathan2004@gmail.com",
      contactLocation: "Chennai, Tamil Nadu, India",
    });
    console.log("✅ Site settings seeded.");

    console.log("\n🚀 All 10 portfolio projects & resume data successfully pushed to MongoDB Atlas!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding portfolio data:", error);
    process.exit(1);
  }
}

seedJobPortfolio();
