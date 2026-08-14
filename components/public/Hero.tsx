"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import InfiniteCarousel from "./InfiniteCarousel";

interface SocialLink {
  platform: string;
  url: string;
  order: number;
}

interface HeroProps {
  badgeText: string;
  headline: string;
  portraitImageUrl?: string;
  portraitAlt?: string;
  captionName?: string;
  socialLinks?: SocialLink[];
}

export default function Hero({ badgeText, headline, portraitImageUrl, portraitAlt, captionName, socialLinks = [] }: HeroProps) {
  const headlineLines = headline.split("\n").filter(Boolean);
  const sorted = [...socialLinks].sort((a, b) => a.order - b.order);

  const renderHighlightedLine = (line: string) => {
    const parts = line.split(/(fast|secure)/i);
    return parts.map((part, index) => {
      if (/^(fast|secure)$/i.test(part)) {
        return <span key={index} className="text-green-accent drop-shadow-[0_0_15px_rgba(0,255,128,0.3)]">{part}</span>;
      }
      return part;
    });
  };

  const carouselItems = ["LOADING_MODULES", "DATA_SYNC", "SYSTEM_SECURE", "OPTIMIZING_ASSETS", "ESTABLISHING_CONNECTION", "ACCESS_GRANTED"];

  const renderCarouselItems = carouselItems.map((text, i) => (
    <span key={i} className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest uppercase font-mono text-text-tertiary mx-8 opacity-60">{text}</span>
  ));

  const imageCarouselItems = [
    <div key={1} className="w-16 h-16 rounded bg-border-subtle flex items-center justify-center opacity-50 mx-4 border border-border-subtle/50"><span className="text-xs font-mono text-text-tertiary">IMG_01</span></div>,
    <div key={2} className="w-16 h-16 rounded bg-border-subtle flex items-center justify-center opacity-50 mx-4 border border-border-subtle/50"><span className="text-xs font-mono text-text-tertiary">IMG_02</span></div>,
    <div key={3} className="w-16 h-16 rounded bg-border-subtle flex items-center justify-center opacity-50 mx-4 border border-border-subtle/50"><span className="text-xs font-mono text-text-tertiary">IMG_03</span></div>,
    <div key={4} className="w-16 h-16 rounded bg-border-subtle flex items-center justify-center opacity-50 mx-4 border border-border-subtle/50"><span className="text-xs font-mono text-text-tertiary">IMG_04</span></div>,
    <div key={5} className="w-16 h-16 rounded bg-border-subtle flex items-center justify-center opacity-50 mx-4 border border-border-subtle/50"><span className="text-xs font-mono text-text-tertiary">IMG_05</span></div>,
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-8rem)] flex flex-col justify-center py-12 overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-radial-green pointer-events-none opacity-50" />
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-green-accent/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-green-accent/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Left Profile Photo */}
      {portraitImageUrl && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-10 left-4 sm:top-8 sm:left-8 md:top-12 md:left-12 z-20 flex items-center gap-3 sm:gap-4 max-w-[85vw]"
        >
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-green-accent shadow-[0_0_20px_rgba(0,255,128,0.3)] shrink-0">
            <img src={portraitImageUrl} alt={portraitAlt || "Profile"} className="object-cover w-full h-full" />
          </div>
          {captionName && (
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-xs font-mono text-green-accent uppercase tracking-widest truncate">System Admin</span>
              <span className="text-base sm:text-lg font-semibold text-text-primary transition-colors truncate">{captionName}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Background Carousels (Unique Ticker Tapes) */}
      <div className="absolute top-[2%] md:top-[5%] -left-[10%] w-[120%] rotate-[-4deg] opacity-40 pointer-events-none border-y border-green-accent/30 bg-bg-card/40 backdrop-blur-sm py-4 md:py-6 lg:py-8 z-0 shadow-[0_0_40px_rgba(0,255,128,0.1)]">
        <InfiniteCarousel items={renderCarouselItems} speed="slow" direction="right" />
      </div>
      <div className="absolute bottom-[20%] -left-[10%] w-[120%] rotate-[3deg] opacity-30 pointer-events-none border-y border-green-accent/30 bg-bg-card/40 backdrop-blur-sm py-4 z-0 shadow-[0_0_30px_rgba(0,255,128,0.1)]">
        <InfiniteCarousel items={imageCarouselItems} speed="normal" direction="left" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 relative z-10 flex flex-col items-center text-center lg:mt-24 mt-20 sm:mt-16">
        <h1 className="text-[clamp(2.25rem,12.5vw,4.5rem)] md:text-[clamp(4rem,9vw,6rem)] lg:text-5xl xl:text-6xl font-display uppercase tracking-tighter text-text-primary leading-[0.85] lg:leading-[0.95] mb-8 sm:mb-12">
          {headlineLines.map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="block cursor-default drop-shadow-lg"
            >
              {renderHighlightedLine(line)}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 mt-4 sm:mt-8 w-full sm:w-auto px-4 sm:px-0"
        >
          {sorted.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="px-4 sm:px-6 py-3 rounded border border-border-subtle bg-bg-container/50 hover:bg-green-accent/10 hover:border-green-accent/30 text-text-secondary hover:text-green-accent font-mono text-xs sm:text-sm tracking-widest uppercase transition-all backdrop-blur-sm shadow-lg hover:shadow-[0_0_15px_rgba(0,255,128,0.2)] text-center w-full sm:w-auto"
            >
              / {link.platform}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
