"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    if (l.includes("testimonial") || l.includes("review")) return <Star size={18} />;
    if (l.includes("contact")) return <Mail size={18} />;
    return <LayoutGrid size={18} />;
  };

  const formatHref = (href: string) => href.replace("#hero", "/").replace("#", "/");
  const displayLinks = [...navLinks].sort((a, b) => a.order - b.order).slice(0, 7);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-card/95 backdrop-blur-md border-t border-x border-border-subtle rounded-t-2xl rounded-b-none pb-safe overflow-hidden">
      <div className="flex items-center justify-around p-1.5 sm:p-2">
        {displayLinks.map((link, index) => {
          const pathHref = formatHref(link.href);
          const isActive = pathname === pathHref || (pathname.startsWith(pathHref) && pathHref !== "/");
          const isTabletOnly = index === 6;

          return (
            <Link
              key={link.href}
              href={pathHref}
              className={cn(
                "flex-col items-center justify-center p-1.5 gap-0.5 sm:gap-1 transition-colors shrink-0",
                isTabletOnly ? "hidden sm:flex" : "flex",
                isActive ? "text-green-accent" : "text-text-tertiary hover:text-green-accent"
              )}
            >
              {getIcon(link.label)}
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
                {link.label.toLowerCase().includes("testimonial") ? "Reviews" : link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
