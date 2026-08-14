"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function TopBreadcrumbNavbar() {
  const pathname = usePathname();
  
  const getPageName = () => {
    if (pathname === "/") return "HERO_MODULE";
    const segment = pathname.split("/")[1];
    return segment ? `${segment.toUpperCase()}_MODULE` : "UNKNOWN_MODULE";
  };

  return (
    <div className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle p-3 sm:p-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-accent" />
        </div>
        <motion.div 
          key={pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-mono text-xs font-bold text-text-tertiary tracking-widest uppercase"
        >
          SYSTEM // <span className="text-green-accent">{getPageName()}</span>
        </motion.div>
      </div>
      
      <Link href="/contact" className="flex items-center justify-center sm:gap-2 font-mono text-[10px] text-text-tertiary hover:text-green-accent transition-colors bg-green-accent/10 sm:bg-transparent w-10 h-10 sm:w-auto sm:h-auto rounded-full sm:rounded-none border border-green-accent/20 sm:border-transparent relative">
        <span className="absolute sm:relative top-2.5 right-2.5 sm:top-auto sm:right-auto flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-accent"></span>
        </span>
        <Mail className="w-4 h-4 sm:hidden text-green-accent shrink-0" />
        <span className="hidden sm:inline">CONNECTION_SECURE</span>
      </Link>
    </div>
  );
}
