"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { User, Download, ArrowRight } from "lucide-react";
import InfiniteCarousel from "./InfiniteCarousel";

interface AboutProps {
  tagLabel: string;
  bioRichText: string;
  cvUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  heroImageUrl?: string;
  captionName?: string;
}

export default function About({ tagLabel, bioRichText, cvUrl, imageUrl, imageAlt, heroImageUrl, captionName }: AboutProps) {
  const carouselItems = [
    <span key={1} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">FULL_STACK_DEV</span>,
    <span key={2} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">SYSTEM_ARCHITECT</span>,
    <span key={3} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">UI_ENGINEER</span>,
  ];

  return (
    <section id="about" className="py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute top-[10%] left-0 w-full opacity-20 pointer-events-none">
        <InfiniteCarousel items={carouselItems} speed="normal" direction="right" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-2 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 items-stretch">

          {/* Left: Premium Image Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-2 lg:order-1 hidden md:block h-full"
          >
            <div className="relative h-full min-h-[400px] w-full rounded-[2.5rem] overflow-hidden border border-border-subtle/50 bg-bg-container/80 p-3">
              <div className="w-full h-full relative rounded-[2rem] overflow-hidden bg-bg-card">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={imageAlt || "About photo"}
                    fill
                    className="object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center font-mono text-text-tertiary gap-4">
                    <User size={48} className="opacity-20" />
                    <span>AWAITING_VISUAL_DATA</span>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-accent/10 rounded-full blur-3xl -z-10"
            />
            <div className="absolute top-12 -left-8 w-16 h-16 border border-border-subtle/30 rounded-full bg-bg-container/40 backdrop-blur-sm hidden md:flex items-center justify-center text-green-accent">
              <span className="font-mono text-xs">{"//"}</span>
            </div>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 w-full flex flex-col items-center lg:items-start"
          >
            <div className="w-full text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-1.5 md:mb-5 lg:mb-3 px-2 md:px-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-accent/5 border border-green-accent/20 text-sm text-green-accent font-mono backdrop-blur-sm">
                  <User size={16} />
                  <span className="tracking-widest uppercase">{tagLabel}</span>
                </div>

                <Link
                  href="/projects"
                  className="group hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-accent/30 bg-green-accent/10 hover:bg-green-accent/20 text-xs sm:text-sm font-mono uppercase tracking-widest text-green-accent transition-all"
                >
                  <span>View Work</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <h2 className="w-full text-center lg:text-left text-4xl lg:text-5xl font-display text-text-primary uppercase tracking-tight leading-tight sm:leading-tight mb-2 md:mb-8 lg:mb-8 px-2 md:px-0">
                Who I Am
              </h2>
            </div>

            <div className="w-full bg-bg-card/40 border border-border-subtle/30 rounded-xl p-3 min-[400px]:p-4 md:bg-transparent md:border-none md:p-0 md:rounded-none mt-1 min-[400px]:mt-2 md:mt-2 lg:mt-0 mb-3 min-[400px]:mb-5 sm:mb-6 md:mb-12 lg:mb-10">
              <div className="prose prose-invert text-justify prose-p:text-text-primary prose-p:text-base sm:prose-p:text-lg prose-p:font-semibold prose-p:leading-relaxed prose-p:mb-2 md:prose-p:mb-4 prose-p:text-justify prose-a:text-green-accent hover:prose-a:underline max-w-none transition-colors">
                <div dangerouslySetInnerHTML={{ __html: bioRichText }} />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 px-2 md:px-0 w-full">
              <a
                href={cvUrl || "#"}
                target={cvUrl ? "_blank" : "_self"}
                rel="noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-accent text-bg-primary font-sans font-semibold rounded-full overflow-hidden transition-all hover:bg-green-accent/80 hover:scale-105 active:scale-95 text-center w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Download size={18} />
                  {cvUrl ? "Download Resume" : "Download Resume"}
                </span>
              </a>

              {/* View Work: Shown in this row only on Tablet view */}
              <Link
                href="/projects"
                className="group hidden md:inline-flex lg:hidden items-center justify-center gap-2 px-6 py-4 rounded-full border border-green-accent/30 bg-green-accent/10 hover:bg-green-accent/20 font-mono text-sm font-semibold uppercase tracking-widest text-green-accent transition-all hover:scale-105 active:scale-95"
              >
                <span>View Work</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
