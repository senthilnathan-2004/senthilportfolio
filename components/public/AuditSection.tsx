"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  ChevronDown,
  ChevronUp,
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
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(4);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset pagination when category changes
  useEffect(() => {
    setVisibleCount(4);
  }, [selectedCategory]);

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

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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
      className="relative py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-green-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-accent/10 border border-green-accent/20 text-green-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          // Quality & Performance Benchmarks
        </div>

        <h2 className="hidden sm:block text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-text-primary mb-4">
          Verified Performance & Security Audits
        </h2>

        {/* Filter Tabs - Single row horizontal scroll on mobile, centered on desktop */}
        <div className="w-full relative flex justify-center mt-4 sm:mt-8">
          {/* Mobile Scroll Fade Indicators */}
          <div className="sm:hidden absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-primary via-bg-primary/80 to-transparent pointer-events-none z-20" />
          <div className="sm:hidden absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none z-20" />

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1.5 px-4 sm:px-0 sm:flex-wrap sm:justify-center scroll-smooth snap-x snap-mandatory touch-pan-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? audits.length
                  : audits.filter((a) => a.category === cat).length;
              if (count === 0 && cat !== "All") return null;

              return (
                <button
                  key={cat}
                  onClick={(e) => {
                    setSelectedCategory(cat);
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      inline: "center",
                      block: "nearest",
                    });
                  }}
                  className={`relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-mono text-xs sm:text-sm transition-all shrink-0 whitespace-nowrap snap-center ${
                    selectedCategory === cat
                      ? "bg-green-accent text-bg-primary font-bold shadow-[0_0_20px_rgba(0,255,128,0.3)]"
                      : "bg-bg-card border border-border-subtle text-text-secondary hover:border-green-accent/40 hover:text-text-primary"
                  }`}
                >
                  {cat} <span className="opacity-70 text-[11px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {displayed.map((item) => (
          <div
            key={item._id}
            className="group relative rounded-2xl sm:rounded-3xl bg-bg-card/70 border border-border-subtle hover:border-green-accent/40 p-3.5 sm:p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl hover:shadow-green-accent/5 backdrop-blur-sm"
          >
            <div>
              {/* Header inside card: Badge + Metric */}
              <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md sm:rounded-lg bg-bg-primary border border-border-subtle text-[11px] sm:text-xs font-mono text-text-primary whitespace-nowrap min-w-0 max-w-[60%] sm:max-w-none">
                  <span className="shrink-0">{getCategoryIcon(item.category)}</span>
                  <span className="truncate">{item.badgeText || item.category}</span>
                </span>

                {item.scoreOrMetric && (
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold text-green-accent bg-green-accent/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-green-accent/20 whitespace-nowrap shrink-0">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{item.scoreOrMetric}</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg sm:text-xl font-display font-bold text-text-primary mb-1.5 group-hover:text-green-accent transition-colors leading-snug">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-text-secondary text-xs sm:text-sm mb-3.5 leading-relaxed font-mono">
                  {item.description}
                </p>
              )}

              {/* Image Preview with Zoom Trigger */}
              {item.imageUrl ? (
                <div
                  onClick={() => setActiveModalImage(item.imageUrl)}
                  className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden bg-bg-primary border border-border-subtle cursor-pointer group/img transition-all hover:border-green-accent/50 shadow-inner"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover object-top transition-all duration-500 group-hover/img:scale-105 blur-[2.5px] group-hover/img:blur-none"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Centered 'Click to open full image' overlay for all devices */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3 transition-all duration-300 pointer-events-none group-hover/img:bg-black/50">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-green-accent/40 text-white font-mono text-[11px] sm:text-xs shadow-2xl group-hover/img:scale-105 group-hover/img:border-green-accent transition-transform">
                      <ZoomIn className="w-3.5 h-3.5 text-green-accent shrink-0" />
                      <span>Click to open full image</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[16/9] rounded-xl sm:rounded-2xl bg-bg-primary/50 border border-dashed border-border-subtle flex flex-col items-center justify-center p-4 text-center text-text-tertiary">
                  <FileText className="w-7 h-7 mb-1.5 opacity-50 text-green-accent" />
                  <span className="text-xs font-mono">Report screenshot uploading via Admin</span>
                </div>
              )}
            </div>

            {/* Bottom Actions: PDF / Live Verification Link */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3.5 mt-3.5 border-t border-border-subtle text-xs font-mono">
              {item.pdfUrl ? (
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-md sm:rounded-lg border border-blue-500/20 text-[11px] sm:text-xs"
                >
                  <FileText className="w-3 h-3" />
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
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-green-accent font-medium transition-colors text-[11px] sm:text-xs"
                >
                  Inspect Live Site <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* See More / Show Less Pagination Button */}
      {filtered.length > 4 && (
        <div className="flex items-center justify-center gap-3 mt-8 sm:mt-10">
          {hasMore ? (
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-bg-card border border-border-subtle hover:border-green-accent/50 text-text-primary font-mono text-xs sm:text-sm transition-all shadow-lg hover:shadow-green-accent/10 cursor-pointer active:scale-95"
            >
              <span>See More Audits ({filtered.length - visibleCount} more)</span>
              <ChevronDown className="w-4 h-4 text-green-accent transition-transform group-hover:translate-y-0.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setVisibleCount(4);
                document.getElementById("audits")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-bg-card border border-border-subtle hover:border-green-accent/50 text-text-secondary hover:text-text-primary font-mono text-xs sm:text-sm transition-all shadow-lg cursor-pointer active:scale-95"
            >
              <span>Show Less</span>
              <ChevronUp className="w-4 h-4 text-green-accent transition-transform group-hover:-translate-y-0.5" />
            </button>
          )}
        </div>
      )}

      {/* Fullscreen Lightbox Modal via Portal to avoid clipping and mobile nav overlap */}
      {mounted &&
        activeModalImage &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setActiveModalImage(null)}
          >
            {/* Top Toolbar with Close Button */}
            <div className="w-full flex items-center justify-between max-w-6xl mx-auto py-2 z-10 shrink-0">
              <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
                // Click anywhere or press ESC to close
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModalImage(null);
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-800/90 border border-zinc-700 text-white hover:bg-zinc-700 hover:text-green-accent hover:border-green-accent/40 font-mono text-xs transition-all shadow-xl cursor-pointer"
                aria-label="Close enlarged preview"
              >
                <span>Close</span>
                <X className="w-4 h-4 text-green-accent" />
              </button>
            </div>

            {/* Center Image Container */}
            <div
              className="relative flex-1 w-full max-w-5xl my-auto flex items-center justify-center min-h-0 py-2"
              onClick={() => setActiveModalImage(null)}
            >
              <div
                className="relative w-full h-full max-h-[75vh] sm:max-h-[82vh] rounded-2xl overflow-hidden bg-zinc-950/90 border border-zinc-800 shadow-2xl p-1.5 sm:p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={activeModalImage}
                  alt="Enlarged Audit Report"
                  fill
                  className="object-contain"
                  priority
                  sizes="100vw"
                />
              </div>
            </div>

            {/* Bottom Mobile Tap Helper */}
            <div className="w-full text-center py-1 sm:hidden text-[10px] font-mono text-zinc-500 shrink-0">
              Tap anywhere outside the image to close
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
