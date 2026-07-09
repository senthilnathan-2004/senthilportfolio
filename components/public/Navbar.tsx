"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink { label: string; href: string; order: number; }
interface SocialLink { platform: string; url: string; order: number; }

interface NavbarProps {
  logoText: string;
  navLinks: NavLink[];
  ctaText: string;
  ctaHref: string;
  socialLinks: SocialLink[];
}

export default function Navbar({ logoText, navLinks, ctaText, ctaHref, socialLinks }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoSlash = logoText.startsWith("//") ? "//" : "";
  const logoRest = logoText.startsWith("//") ? logoText.slice(2) : logoText;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "py-3 bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle/50 shadow-card" : "py-5 bg-transparent"
        )}
        id="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="font-mono text-green-accent font-bold text-lg leading-none">{logoSlash}</span>
            <span className="font-mono text-text-primary font-semibold text-lg leading-none">{logoRest}</span>
          </Link>

          {/* Center: Hamburger (shown always, like reference) */}
          <button
            id="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col items-center justify-center gap-[5px] p-2 hover:opacity-70 transition-opacity"
            aria-label="Menu"
          >
            <span className={cn("hamburger-line transition-all", mobileOpen && "rotate-45 translate-y-[6.5px]")} />
            <span className={cn("hamburger-line transition-all", mobileOpen && "opacity-0")} />
            <span className={cn("hamburger-line transition-all", mobileOpen && "-rotate-45 -translate-y-[6.5px]")} />
          </button>

          {/* CTA */}
          <Link
            href={ctaHref}
            id="nav-cta"
            className="shrink-0 px-5 py-2.5 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold text-sm rounded-full transition-all hover:scale-[1.05] active:scale-[0.98]"
          >
            {ctaText}
          </Link>
        </div>
      </nav>

      {/* Mobile / Desktop slide-in drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mt-20 animate-scale-in">
            <div className="mx-4 bg-bg-card border border-border-subtle rounded-3xl p-6 shadow-card">
              {/* Nav items */}
              {navLinks.sort((a, b) => a.order - b.order).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 font-mono text-text-secondary hover:text-green-accent transition-colors text-sm border-b border-border-subtle last:border-0"
                >
                  <span className="text-green-accent">/ </span>{link.label}
                </a>
              ))}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border-subtle flex flex-wrap gap-2">
                  {socialLinks.sort((a, b) => a.order - b.order).map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-text-tertiary hover:text-green-accent transition-colors"
                    >
                      /{link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
