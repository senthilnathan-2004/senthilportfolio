"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Code2, FolderKanban, Star, Mail, LayoutGrid, Home } from "lucide-react";

interface NavLink { label: string; href: string; order: number; }

interface PublicMobileNavProps {
  navLinks: NavLink[];
}

export default function PublicMobileNav({ navLinks }: PublicMobileNavProps) {
  const pathname = usePathname();

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("home")) return <Home size={18} />;
    if (l.includes("about")) return <User size={18} />;
    if (l.includes("skill")) return <Code2 size={18} />;
    if (l.includes("project") || l.includes("work")) return <FolderKanban size={18} />;
    if (l.includes("contact")) return <Mail size={18} />;
    return <LayoutGrid size={18} />;
  };

  const formatHref = (href: string) => href.replace("#hero", "/").replace("#", "/");
  const displayLinks = [...navLinks].sort((a, b) => a.order - b.order);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl rounded-b-none p-[1.5px] pb-0 bg-border-subtle overflow-hidden">
      {/* 360 Infinite Rotating Border Beam starting from the left border start point */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
        className="absolute -inset-[200%] bg-[conic-gradient(from_270deg,transparent_0_310deg,#8CFF9E_360deg)] pointer-events-none opacity-90"
      />

      {/* Traveling Border Beam starting at left border edge */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] overflow-hidden pointer-events-none z-20">
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-green-accent to-transparent"
        />
      </div>

      {/* Inner Navigation Content */}
      <div className="relative z-10 bg-bg-card/95 backdrop-blur-md rounded-t-[15px] pb-safe">
        <div className="flex items-center justify-around p-1.5 sm:p-2">
          {displayLinks.map((link) => {
            const pathHref = formatHref(link.href);
            const isActive = pathname === pathHref || (pathname.startsWith(pathHref) && pathHref !== "/");

            return (
              <Link
                key={link.href}
                href={pathHref}
                className={cn(
                  "flex flex-col items-center justify-center p-1.5 gap-0.5 sm:gap-1 transition-colors shrink-0",
                  isActive ? "text-green-accent" : "text-text-tertiary hover:text-green-accent"
                )}
              >
                {getIcon(link.label)}
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
