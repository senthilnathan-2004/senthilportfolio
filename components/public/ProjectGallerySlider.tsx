"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Pause,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

export interface GallerySlide {
  url: string;
  alt?: string;
  fileId?: string;
  order?: number;
}

interface ProjectGallerySliderProps {
  slides: GallerySlide[];
  projectTitle: string;
  category?: string;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

export default function ProjectGallerySlider({
  slides,
  projectTitle,
  category,
}: ProjectGallerySliderProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [objectFit, setObjectFit] = useState<"contain" | "cover">("contain");

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = slides.length;

  const paginate = useCallback(
    (newDirection: number) => {
      if (total <= 1) return;
      setDirection(newDirection);
      setCurrentIndex((prev) => (prev + newDirection + total) % total);
    },
    [total]
  );

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || total <= 1 || isLightboxOpen) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, total, isLightboxOpen, paginate]);

  // Keyboard navigation & lock scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        paginate(-1);
      } else if (e.key === "ArrowRight") {
        paginate(1);
      } else if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [paginate, isLightboxOpen]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="w-full mb-8 sm:mb-12 select-none">
      {/* Top Bar / Mode switcher */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-3 px-0.5 sm:px-1">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 h-8 rounded-full bg-bg-card border border-border-subtle text-[11px] sm:text-xs font-mono text-text-secondary whitespace-nowrap">
            <Layers size={13} className="text-green-accent shrink-0" />
            <span className="hidden xs:inline">Interactive Showcase</span>
            <span className="xs:hidden">Showcase</span>
          </div>
          <span className="font-mono text-xs text-text-tertiary hidden sm:inline whitespace-nowrap">
            {currentIndex + 1} / {total}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Object fit mode toggle */}
          <button
            type="button"
            onClick={() => setObjectFit((prev) => (prev === "contain" ? "cover" : "contain"))}
            title={objectFit === "contain" ? "Switch to Cover Fill" : "Switch to Fit Screen"}
            className="flex items-center justify-center gap-1 px-2.5 h-8 rounded-lg bg-bg-card border border-border-subtle hover:border-green-accent/40 text-text-secondary hover:text-green-accent text-[11px] sm:text-xs font-mono transition-all whitespace-nowrap shrink-0"
          >
            <span className="hidden xs:inline">{objectFit === "contain" ? "Fit View" : "Fill View"}</span>
            <span className="xs:hidden">{objectFit === "contain" ? "Fit" : "Fill"}</span>
          </button>

          {/* Autoplay toggle */}
          {total > 1 && (
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              title={isPlaying ? "Pause Auto-play" : "Start Auto-play"}
              className={`flex items-center justify-center gap-1 px-2.5 h-8 rounded-lg border text-[11px] sm:text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
                isPlaying
                  ? "bg-green-accent/10 border-green-accent/40 text-green-accent"
                  : "bg-bg-card border border-border-subtle hover:border-green-accent/40 text-text-secondary hover:text-text-primary"
              }`}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
            </button>
          )}

          {/* Fullscreen Expand */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            title="Expand Fullscreen"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-bg-card border border-border-subtle hover:border-green-accent/40 text-text-secondary hover:text-green-accent text-xs transition-all shrink-0"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Main Slide Card Viewport */}
      <div className="relative group rounded-2xl sm:rounded-3xl lg:rounded-4xl border border-border-subtle bg-bg-card overflow-hidden shadow-2xl transition-all hover:border-green-accent/30">
        {/* Ambient Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-bg-primary via-bg-card to-bg-container opacity-80" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-green-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Viewport Frame */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={total > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -100 || offset.x < -60) {
                  paginate(1);
                } else if (swipe > 100 || offset.x > 60) {
                  paginate(-1);
                }
              }}
              onClick={() => setIsLightboxOpen(true)}
              className="absolute inset-0 cursor-zoom-in flex items-center justify-center p-2 sm:p-4 md:p-6"
            >
              <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                <Image
                  src={currentSlide.url}
                  alt={currentSlide.alt || `${projectTitle} screenshot ${currentIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                  priority={currentIndex === 0}
                  className={`transition-all duration-300 ${
                    objectFit === "contain"
                      ? "object-contain drop-shadow-2xl"
                      : "object-cover object-top"
                  }`}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            {/* Slide badge & info */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-mono font-semibold text-green-accent">
                {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              {currentSlide.alt && (
                <span className="hidden md:inline-block max-w-xs truncate px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-text-secondary">
                  {currentSlide.alt}
                </span>
              )}
            </div>

            {/* Click to zoom hint */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-text-tertiary pointer-events-auto">
              <Sparkles size={11} className="text-green-accent" />
              <span>Click image to expand</span>
            </div>
          </div>

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
                aria-label="Previous image"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-green-accent text-white hover:text-bg-primary backdrop-blur-md border border-white/10 hover:border-green-accent flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg group-hover:opacity-100 opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronLeft size={18} className="sm:hidden" />
                <ChevronLeft size={20} className="hidden sm:block" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
                aria-label="Next image"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-green-accent text-white hover:text-bg-primary backdrop-blur-md border border-white/10 hover:border-green-accent flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg group-hover:opacity-100 opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronRight size={18} className="sm:hidden" />
                <ChevronRight size={20} className="hidden sm:block" />
              </button>
            </>
          )}

          {/* Auto-play progress bar indicator */}
          {isPlaying && (
            <motion.div
              key={`progress-${currentIndex}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-green-accent origin-left z-20"
            />
          )}
        </div>
      </div>

      {/* Thumbnails Navigation Filmstrip */}
      {total > 1 && (
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 px-1 scroll-smooth snap-x snap-mandatory touch-pan-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {slides.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`relative flex-shrink-0 w-16 sm:w-28 md:w-32 aspect-video rounded-lg sm:rounded-2xl overflow-hidden border transition-all duration-200 snap-center group ${
                    isActive
                      ? "border-green-accent ring-2 ring-green-accent/30 scale-105 shadow-md shadow-green-accent/10"
                      : "border-border-subtle opacity-60 hover:opacity-100 hover:border-green-accent/40"
                  }`}
                >
                  <Image
                    src={item.url}
                    alt={item.alt || `Thumbnail ${idx + 1}`}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                  <div
                    className={`absolute inset-0 transition-colors ${
                      isActive ? "bg-green-accent/10" : "bg-black/30 group-hover:bg-transparent"
                    }`}
                  />
                  <span
                    className={`absolute bottom-1 right-1 px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono leading-none ${
                      isActive
                        ? "bg-green-accent text-bg-primary font-bold"
                        : "bg-black/70 text-white/80"
                    }`}
                  >
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal Portal */}
      {mounted &&
        isLightboxOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 select-none h-[100dvh] w-screen overflow-hidden"
            >
              {/* Lightbox Header */}
              <div className="flex items-center justify-between w-full max-w-7xl mx-auto z-20 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-mono text-[10px] sm:text-xs text-green-accent px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-green-accent/10 border border-green-accent/20">
                    {category || "Project"}
                  </span>
                  <h3 className="font-mono font-bold text-text-primary text-xs sm:text-base truncate max-w-[180px] sm:max-w-md">
                    {projectTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-mono text-xs text-text-secondary">
                    {currentIndex + 1} / {total}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-green-accent text-white hover:text-bg-primary transition-all duration-200"
                    aria-label="Close Lightbox"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Lightbox Center Image Viewport (Dead-Centered on Mobile, Tablet, and Desktop) */}
              <div className="relative flex-1 min-h-0 w-full max-w-7xl mx-auto my-auto flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative w-full h-full flex items-center justify-center p-1 sm:p-4"
                  >
                    <div className="relative w-full h-full max-h-[70dvh] sm:max-h-[80dvh] flex items-center justify-center">
                      <Image
                        src={currentSlide.url}
                        alt={currentSlide.alt || `${projectTitle} Fullscreen ${currentIndex + 1}`}
                        fill
                        sizes="100vw"
                        priority
                        className="object-contain drop-shadow-2xl"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Lightbox Arrows */}
                {total > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => paginate(-1)}
                      className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-green-accent text-white hover:text-bg-primary backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl border border-white/10"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() => paginate(1)}
                      className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-green-accent text-white hover:text-bg-primary backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl border border-white/10"
                      aria-label="Next"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Lightbox Footer with Caption & Thumbnails */}
              <div className="w-full max-w-7xl mx-auto z-20 shrink-0 pb-safe">
                {currentSlide.alt && (
                  <p className="text-center font-mono text-[11px] sm:text-xs text-text-secondary mb-2 truncate px-4">
                    {currentSlide.alt}
                  </p>
                )}
                {total > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
                    {slides.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        className={`relative flex-shrink-0 w-12 sm:w-20 aspect-video rounded-md sm:rounded-lg overflow-hidden border transition-all ${
                          idx === currentIndex
                            ? "border-green-accent ring-2 ring-green-accent/30 scale-105"
                            : "border-white/10 opacity-50 hover:opacity-100"
                        }`}
                      >
                        <Image src={item.url} alt="" fill sizes="80px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

