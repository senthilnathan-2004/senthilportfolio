"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Code2, FolderKanban, Mail, LayoutGrid, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink { label: string; href: string; order: number; }
interface SocialLink { platform: string; url: string; order: number; }

interface PublicSidebarProps {
  logoText: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
}

export default function PublicSidebar({ logoText, navLinks, socialLinks }: PublicSidebarProps) {
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

  const logoSlash = logoText.startsWith("//") ? "//" : "";
  const logoRest = logoText.startsWith("//") ? logoText.slice(2).trim() : logoText.trim();

  // Convert old hash links (#about) to path links (/about)
  const formatHref = (href: string) => href.replace("#hero", "/").replace("#", "/");

  return (
    <aside className="w-64 xl:w-72 h-full bg-bg-primary/95 backdrop-blur-xl border border-border-subtle rounded-3xl flex flex-col overflow-hidden relative shrink-0">
      {/* Logo Area */}
      <div className="p-6 xl:p-8 border-b border-border-subtle/50">
        <Link href="/" className="flex items-center gap-1.5 shrink-0 whitespace-nowrap overflow-hidden">
          <span className="font-mono text-green-accent font-bold text-xl xl:text-2xl leading-none shrink-0">{logoSlash}</span>
          <span className="font-mono text-text-primary font-bold text-[15px] xl:text-[17px] leading-none uppercase tracking-wide whitespace-nowrap">{logoRest}</span>
        </Link>
        <div className="mt-3 text-xs font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">
          System_Online // 
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 flex flex-col gap-2.5 overflow-y-auto">
        {[...navLinks].sort((a, b) => a.order - b.order).map((link) => {
          const pathHref = formatHref(link.href);
          const isActive = pathname === pathHref || (pathname.startsWith(pathHref) && pathHref !== "/");
          
          return (
            <Link
              key={link.href}
              href={pathHref}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all font-mono uppercase text-sm tracking-wider",
                isActive
                  ? "border-green-accent/40 bg-green-accent/10 text-green-accent"
                  : "border-transparent text-text-secondary hover:text-green-accent hover:bg-bg-card/60 hover:border-border-subtle/40"
              )}
            >
              <span className={cn("transition-colors", isActive ? "text-green-accent" : "text-text-tertiary")}>
                {getIcon(link.label)}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Socials Footer */}
      {socialLinks.length > 0 && (
        <div className="p-6 border-t border-border-subtle/50">
          <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest mb-4">
            [ External_Links ]
          </p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.sort((a, b) => a.order - b.order).map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-text-secondary hover:text-green-accent transition-colors uppercase"
              >
                /{link.platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
