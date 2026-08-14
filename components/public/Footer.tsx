"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

interface FooterProps {
  logoText: string;
  footerText: string;
  quickLinks: Array<{ label: string; href: string; order: number }>;
  socialLinks: Array<{ platform: string; url: string; order: number }>;
  startupName?: string;
  startupUrl?: string;
}

export default function Footer({ logoText, footerText, quickLinks, socialLinks, startupName, startupUrl }: FooterProps) {
  const [displayText, setDisplayText] = useState(() =>
    footerText.replace("{year}", new Date().getFullYear().toString())
  );

  useEffect(() => {
    setDisplayText(footerText.replace("{year}", new Date().getFullYear().toString()));
  }, [footerText]);
  const logoSlash = logoText.startsWith("//") ? "//" : "";
  const logoRest = logoText.startsWith("//") ? logoText.slice(2) : logoText;
  const sortedLinks = [...quickLinks].sort((a, b) => a.order - b.order);
  const sortedSocial = [...socialLinks].sort((a, b) => a.order - b.order);

  return (
    <footer className="py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-1 mb-3">
              <span className="font-mono text-green-accent font-bold text-lg">{logoSlash}</span>
              <span className="font-mono text-text-primary font-semibold text-lg">{logoRest}</span>
            </Link>
            <p className="text-text-tertiary text-sm font-mono mb-6">
              Building fast, scalable, and secure digital experiences.
            </p>
            
            {startupName && startupUrl && (
              <div className="flex w-full min-w-0 flex-col border border-border-subtle bg-bg-container/40 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-green-accent/50 transition-colors group">
                <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-widest mb-1.5 shrink-0">Founder & CEO</span>
                <a 
                  href={startupUrl.startsWith('http') ? startupUrl : `https://${startupUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between gap-2 text-sm text-text-primary hover:text-green-accent transition-colors font-mono font-semibold w-full min-w-0"
                >
                  <span className="truncate min-w-0 flex-1">{startupName}</span>
                  <ArrowUp size={14} className="shrink-0 rotate-45 text-green-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">Navigation</p>
            <div className="space-y-2">
              {sortedLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block font-mono text-sm text-text-secondary hover:text-green-accent transition-colors"
                >
                  <span className="text-text-tertiary">/</span> {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">Social</p>
            <div className="space-y-2">
              {sortedSocial.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-sm text-text-secondary hover:text-green-accent transition-colors"
                >
                  <span className="text-text-tertiary">/</span> {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border-subtle">
          <p className="font-mono text-xs text-text-tertiary" suppressHydrationWarning>{displayText}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            id="back-to-top"
            className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-subtle rounded-full font-mono text-xs text-text-secondary hover:text-green-accent hover:border-green-accent/30 transition-all"
          >
            <ArrowUp size={12} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
