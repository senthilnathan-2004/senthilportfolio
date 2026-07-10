"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, GitFork, Star, FolderGit2 } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  coverImageAlt: string;
  shortDescription: string;
  techTags: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  featured: boolean;
  order: number;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter(p => p.category === active);
  const sorted = [...filtered].sort((a, b) => a.order - b.order);

  return (
    <section id="projects" className="py-12 lg:py-16 relative">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-accent/5 border border-green-accent/20 text-sm text-green-accent mb-6 font-mono backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,128,0.1)]">
            <FolderGit2 size={16} />
            <span className="tracking-widest uppercase">Deployments</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-text-primary uppercase tracking-tight">
            Featured Projects
          </h2>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full font-mono text-sm transition-all ${active === cat
                  ? "bg-green-accent text-bg-primary font-bold"
                  : "bg-bg-card border border-border-subtle text-text-secondary hover:border-green-accent/40 hover:text-text-primary"
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {sorted.map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="group relative bg-bg-card border border-border-subtle hover:border-green-accent/30 rounded-3xl overflow-hidden transition-colors"
              >
                {/* Cover image */}
                <div className="relative h-52 overflow-hidden">
                  {project.coverImageUrl ? (
                    <Image
                      src={project.coverImageUrl}
                      alt={project.coverImageAlt || project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-bg-primary to-bg-card flex items-center justify-center">
                      <span className="font-display text-text-tertiary text-2xl uppercase">{project.title.slice(0, 2)}</span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="px-4 py-2 bg-green-accent text-bg-primary font-mono text-xs font-bold rounded-full hover:bg-green-hover transition-colors"
                    >
                      View Case Study
                    </Link>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-card/80 text-text-primary rounded-full hover:bg-bg-card transition-colors">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-card/80 text-text-primary rounded-full hover:bg-bg-card transition-colors">
                        <GitFork size={14} />
                      </a>
                    )}
                  </div>
                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-green-accent/90 text-bg-primary rounded-full">
                      <Star size={10} className="fill-bg-primary" />
                      <span className="font-mono text-xs font-bold">Featured</span>
                    </div>
                  )}
                </div>

                {/* Card content */}
                <div className="p-5">
                  <div className="mb-2">
                    <span className="font-mono text-xs text-green-accent">{project.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary text-justify mb-2 group-hover:text-green-accent transition-colors">
                    {project.title}
                  </h3>
                  {project.shortDescription && (
                    <p className="text-sm text-text-secondary text-justify leading-relaxed mb-4 line-clamp-2">
                      {project.shortDescription}
                    </p>
                  )}
                  {/* Tech tags */}
                  {project.techTags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.techTags.slice(0, 4).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs font-mono text-text-tertiary bg-bg-primary border border-border-subtle rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-text-tertiary font-mono">
            <p>No projects added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
