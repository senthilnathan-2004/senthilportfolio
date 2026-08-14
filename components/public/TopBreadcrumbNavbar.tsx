"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function TopBreadcrumbNavbar() {
  const pathname = usePathname();
  const [showContactHint, setShowContactHint] = useState(true);

  useEffect(() => {
    // Show the "CONTACT" text label on mobile for 15 seconds after page load
    const timer = setTimeout(() => {
      setShowContactHint(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const getPageName = () => {
    if (!pathname || pathname === "/") return "HERO_MODULE";
    const segment = pathname.split("/")[1];
    return segment ? `${segment.toUpperCase()}_MODULE` : "UNKNOWN_MODULE";
  };

  return (
    <div className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle p-3 sm:p-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
        <div className="hidden sm:flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-accent" />
        </div>
        <motion.div 
          key={pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-mono text-[11px] sm:text-xs font-bold text-text-tertiary tracking-widest uppercase truncate"
        >
          SYSTEM // <span className="text-green-accent">{getPageName()}</span>
        </motion.div>
      </div>
      
      <Link 
        href="/contact" 
        className="flex items-center justify-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-xs text-green-accent transition-all bg-green-accent/10 sm:bg-transparent h-9 sm:h-auto px-2.5 sm:px-0 rounded-full sm:rounded-none border border-green-accent/30 sm:border-transparent relative shrink-0 shadow-[0_0_15px_rgba(140,255,158,0.15)] sm:shadow-none hover:bg-green-accent/20 hover:border-green-accent/50"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-accent"></span>
        </span>
        <Mail className="w-3.5 h-3.5 text-green-accent shrink-0" />
        
        {/* Mobile Contact Label shown for 15s */}
        <AnimatePresence>
          {showContactHint && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="sm:hidden overflow-hidden whitespace-nowrap font-bold text-green-accent tracking-wider pl-0.5"
            >
              CONTACT
            </motion.span>
          )}
        </AnimatePresence>

        {/* Desktop Label */}
        <span className="hidden sm:inline text-text-tertiary hover:text-green-accent transition-colors">
          CONNECTION_SECURE
        </span>
      </Link>
    </div>
  );
}
