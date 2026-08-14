"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, Code2, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface WelcomeCardProps {
  name?: string;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export default function WelcomeCard({ name = "Senthilragu" }: WelcomeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const lastShown = localStorage.getItem("welcome_card_last_shown");
      if (lastShown) {
        const timeElapsed = Date.now() - parseInt(lastShown, 10);
        if (!isNaN(timeElapsed) && timeElapsed < ONE_DAY_MS) {
          return; // Shown within 1 day, do not show again
        }
      }
    } catch {
      // Storage access safety fallback
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
      try {
        localStorage.setItem("welcome_card_last_shown", Date.now().toString());
      } catch {
        // Storage access safety fallback
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem("welcome_card_last_shown", Date.now().toString());
    } catch {
      // Storage access safety fallback
    }
  };

  // Prevent SSR hydration mismatches by delaying portal rendering until client mount
  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto min-h-screen">
          {/* Fullscreen Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-0"
          />

          {/* Centered Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 320, delay: 0.05 }}
            className="relative w-full max-w-sm sm:max-w-lg bg-gradient-to-b from-bg-card via-bg-card/98 to-bg-container/95 border border-green-accent/30 sm:border-green-accent/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(140,255,158,0.18)] backdrop-blur-2xl text-text-primary z-10 m-auto overflow-hidden"
          >
            {/* Top Glowing Ambient Accents */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-green-accent/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-green-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Cyberpunk Top Line Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-green-accent/80 to-transparent pointer-events-none" />

            {/* Header: Status Bar + Close Button */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-green-accent/10 border border-green-accent/30 text-green-accent font-mono text-[10px] sm:text-[11px] uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-accent"></span>
                </span>
                <span>SYSTEM INITIALIZED</span>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 sm:p-2 rounded-full text-text-tertiary hover:text-green-accent hover:bg-green-accent/10 transition-colors border border-border-subtle/50 hover:border-green-accent/30 cursor-pointer"
                aria-label="Close welcome card"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>

            {/* Identity & Title Banner */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              {/* Profile/Tech Monogram Badge */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-green-accent/10 border border-green-accent/30 flex items-center justify-center text-green-accent shrink-0 shadow-[0_0_15px_rgba(140,255,158,0.2)] mt-0.5">
                <Code2 size={20} className="sm:hidden" />
                <Sparkles size={24} className="hidden sm:block" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-mono text-green-accent uppercase tracking-wider font-semibold">
                  // PORTFOLIO V2.0
                </p>
                <h2 className="text-base sm:text-2xl font-bold font-display uppercase tracking-tight text-text-primary leading-tight mt-0.5">
                  Welcome to <span className="text-green-accent drop-shadow-[0_0_12px_rgba(140,255,158,0.4)]">{name}</span>
                </h2>
                <p className="font-mono text-[10px] sm:text-xs text-text-tertiary mt-1">
                  Full-Stack Dev &amp; UI Architect
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans mb-4 sm:mb-6">
              Glad to have you here! Feel free to explore interactive projects, skills, custom services, and modern digital experiences.
            </p>

            {/* Tech Feature Cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6 font-mono text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-container/80 border border-border-subtle/80 text-text-secondary">
                <Zap size={14} className="text-green-accent shrink-0" />
                <span className="truncate">Fast &amp; Scalable</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-container/80 border border-border-subtle/80 text-text-secondary">
                <ShieldCheck size={14} className="text-green-accent shrink-0" />
                <span className="truncate">Clean Code</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <Link
                href="/projects"
                onClick={handleClose}
                className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl bg-green-accent text-bg-primary font-mono text-xs font-bold uppercase tracking-wider hover:bg-green-hover transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(140,255,158,0.3)] hover:shadow-[0_0_30px_rgba(140,255,158,0.5)] cursor-pointer"
              >
                <span>Explore Work</span>
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl border border-border-subtle bg-bg-container/50 hover:bg-green-accent/10 hover:border-green-accent/30 text-text-secondary hover:text-green-accent font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
