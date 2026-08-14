"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, Code2, Terminal } from "lucide-react";
import Link from "next/link";

interface WelcomeCardProps {
  name?: string;
}

export default function WelcomeCard({ name = "Senthilragu" }: WelcomeCardProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only show when client enters the home page ("/")
    if (pathname !== "/") {
      setIsOpen(false);
      return;
    }

    // 1 second delay after entering home page
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClose = () => {
    setIsOpen(false);
  };

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

          {/* Centered Popup Card - Floating Above All Viewports */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 300, delay: 0.05 }}
            className="relative w-full max-w-md sm:max-w-lg bg-bg-card/95 border border-green-accent/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(140,255,158,0.2)] backdrop-blur-2xl text-text-primary z-10 my-auto mb-20 lg:mb-auto overflow-hidden"
          >
            {/* Glowing Accent Blobs */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-green-accent/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-green-accent/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-text-tertiary hover:text-green-accent hover:bg-green-accent/10 transition-colors border border-transparent hover:border-green-accent/20 cursor-pointer"
              aria-label="Close welcome card"
            >
              <X size={18} />
            </button>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-accent/10 border border-green-accent/30 text-green-accent font-mono text-[10px] sm:text-[11px] uppercase tracking-widest mb-4 sm:mb-5">
              <span className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
              <span>✦ SYSTEM INITIALIZED</span>
            </div>

            {/* Title Header */}
            <div className="flex items-start gap-3.5 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-accent/10 border border-green-accent/30 flex items-center justify-center text-green-accent shrink-0 shadow-[0_0_20px_rgba(140,255,158,0.25)]">
                <Sparkles size={22} className="sm:w-6 sm:h-6" />
              </div>
              <div className="pr-6">
                <h2 className="text-lg sm:text-2xl font-bold font-display uppercase tracking-tight text-text-primary leading-tight">
                  Welcome to <span className="text-green-accent drop-shadow-[0_0_12px_rgba(140,255,158,0.4)]">{name}</span>'s Portfolio
                </h2>
                <p className="font-mono text-[10px] sm:text-xs text-text-tertiary mt-0.5 sm:mt-1">Full-Stack Developer & UI Architect</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans mb-5 sm:mb-6">
              Glad to have you here! Feel free to explore interactive projects, skills, custom services, and modern digital experiences.
            </p>

            {/* Tech Badges */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6 font-mono text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-bg-container/70 border border-border-subtle/80 text-text-secondary">
                <Code2 size={15} className="text-green-accent shrink-0" />
                <span>Modern Stack</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-bg-container/70 border border-border-subtle/80 text-text-secondary">
                <Terminal size={15} className="text-green-accent shrink-0" />
                <span>Clean Code</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
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
