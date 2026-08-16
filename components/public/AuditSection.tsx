"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Zap,
  Search,
  FileText,
  ExternalLink,
  X,
  ZoomIn,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export interface AuditItem {
  _id: string;
  title: string;
  category: "Security" | "Performance" | "SEO" | "Ranking";
  badgeText: string;
  scoreOrMetric: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  pdfUrl?: string;
  externalLink?: string;
}

interface AuditSectionProps {
  audits: AuditItem[];
}

export default function AuditSection({ audits = [] }: AuditSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModalImage(null);
    };
    if (activeModalImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeModalImage]);

  if (!audits || audits.length === 0) return null;

  const categories = ["All", "Security", "Performance", "SEO", "Ranking"];

  const filtered =
    selectedCategory === "All"
      ? audits
      : audits.filter((a) => a.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Security":
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case "Performance":
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case "SEO":
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case "Ranking":
        return <Search className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-green-accent" />;
    }
  };

  return (
    <section
      id="audits"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-green-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-accent/10 border border-green-accent/20 text-green-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          // Quality & Performance Benchmarks
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-text-primary mb-4">
          Verified Performance & Security Audits
        </h2>

        <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-mono">
          Real-world benchmarks, 99/100 SEO scores, Grade-A security compliance, and high-concurrency stress testing.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? audits.length
                : audits.filter((a) => a.category === cat).length;
            if (count === 0 && cat !== "All") return null;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-green-accent text-bg-primary font-bold shadow-lg shadow-green-accent/20 scale-105"
                    : "bg-bg-card text-text-secondary hover:text-text-primary border border-border-subtle hover:border-green-accent/30"
                }`}
              >
                {cat} <span className="opacity-70 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="group relative rounded-3xl bg-bg-card/70 border border-border-subtle hover:border-green-accent/40 p-5 sm:p-7 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-green-accent/5 backdrop-blur-sm"
          >
            <div>
              {/* Header inside card: Badge + Metric */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bg-primary border border-border-subtle text-xs font-mono text-text-primary">
                  {getCategoryIcon(item.category)}
                  {item.badgeText || item.category}
                </span>

                {item.scoreOrMetric && (
                  <span className="text-xs font-mono font-bold text-green-accent bg-green-accent/10 px-2.5 py-1 rounded-md border border-green-accent/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.scoreOrMetric}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary mb-2.5 group-hover:text-green-accent transition-colors leading-snug">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-text-secondary text-xs sm:text-sm mb-5 leading-relaxed font-mono">
                  {item.description}
                </p>
              )}

              {/* Image Preview with Zoom Trigger */}
              {item.imageUrl ? (
                <div
                  onClick={() => setActiveModalImage(item.imageUrl)}
                  className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-bg-primary border border-border-subtle cursor-pointer group/img transition-all hover:border-green-accent/50 shadow-inner"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs backdrop-blur-[2px]">
                    <ZoomIn className="w-4 h-4 text-green-accent" /> Click to enlarge report
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[16/9] rounded-2xl bg-bg-primary/50 border border-dashed border-border-subtle flex flex-col items-center justify-center p-6 text-center text-text-tertiary">
                  <FileText className="w-8 h-8 mb-2 opacity-50 text-green-accent" />
                  <span className="text-xs font-mono">Report screenshot uploading via Admin</span>
                </div>
              )}
            </div>

            {/* Bottom Actions: PDF / Live Verification Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-border-subtle text-xs font-mono">
              {item.pdfUrl ? (
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Download Full PDF
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-text-tertiary text-[11px]">Audit Verified ✓</span>
              )}

              {item.externalLink && (
                <a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-green-accent font-medium transition-colors"
                >
                  Inspect Live Site <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveModalImage(null)}
        >
          <button
            onClick={() => setActiveModalImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-zinc-800/90 text-white hover:bg-zinc-700 hover:text-green-accent transition-all z-10 shadow-2xl border border-zinc-700"
            aria-label="Close enlarged preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-6xl w-full h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-zinc-950/80 border border-zinc-800 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeModalImage}
              alt="Enlarged Audit Report"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
