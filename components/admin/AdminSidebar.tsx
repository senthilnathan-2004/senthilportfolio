"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/app/admin/actions/authActions";
import {
  LayoutDashboard, Image, User, Code2, BarChart3, FolderKanban,
  MessageSquare, Settings, Star, Briefcase, LogOut, ExternalLink,
  ChevronRight, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero", icon: Image },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/stats", label: "Stats", icon: BarChart3 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/audits", label: "Audits & Proofs", icon: ShieldCheck },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  unreadCount?: number;
}

export default function AdminSidebar({ unreadCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  return (
    <aside className="fixed bottom-0 inset-x-0 z-50 h-16 bg-bg-card border-t border-border-subtle flex flex-row md:sticky md:top-0 md:w-64 md:h-screen md:border-r md:border-t-0 md:flex-col shrink-0">
      {/* Logo */}
      <div className="hidden md:block p-6 border-b border-border-subtle">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-mono text-green-accent font-bold text-lg">//</span>
          <span className="font-mono text-text-primary font-semibold">Admin Panel</span>
        </Link>
        <p className="text-xs text-text-tertiary font-mono mt-1">Portfolio CMS</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 md:p-4 flex flex-row md:flex-col gap-1 md:space-y-1 items-center md:items-stretch overflow-x-auto no-scrollbar">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          const isMessages = href === "/admin/messages";

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl transition-all group shrink-0",
                isActive
                  ? "bg-green-accent/10 text-green-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-primary"
              )}
            >
              <Icon size={20} className={cn("md:w-4 md:h-4", isActive ? "text-green-accent" : "text-text-tertiary group-hover:text-text-secondary")} />
              <span className="font-mono text-sm flex-1 hidden md:flex">{label}</span>
              {isMessages && unreadCount > 0 && (
                <span className="text-xs bg-green-accent text-bg-primary font-mono font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {isActive && <ChevronRight size={12} className="text-green-accent" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden md:block p-4 border-t border-border-subtle space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-all"
        >
          <ExternalLink size={16} className="text-text-tertiary" />
          <span className="font-mono text-sm">View Site</span>
        </Link>
        <button
          onClick={() => adminLogout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          <span className="font-mono text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
