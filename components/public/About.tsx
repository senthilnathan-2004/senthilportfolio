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
}

export default function About({ tagLabel, bioRichText, cvUrl, imageUrl, imageAlt }: AboutProps) {
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
            <div className="relative h-full min-h-[400px] w-full rounded-[2.5rem] overflow-hidden border border-border-subtle/50 shadow-[0_0_40px_rgba(0,255,128,0.05)] bg-bg-container/80 p-3">
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
                {/* Inner Glow */}
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] pointer-events-none" />
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
            className="order-1 lg:order-2"
          >
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-8 px-2 md:px-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-accent/5 border border-green-accent/20 text-sm text-green-accent font-mono backdrop-blur-sm">
                  <User size={16} />
                  <span className="tracking-widest uppercase">{tagLabel}</span>
                </div>

                <Link
                  href="/projects"
                  className="group hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-accent/30 bg-green-accent/10 hover:bg-green-accent/20 text-xs sm:text-sm font-mono uppercase tracking-widest text-green-accent transition-all shadow-[0_0_15px_rgba(0,255,128,0.15)]"
                >
                  <span>View Work</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <h2 className="text-4xl lg:text-5xl font-display text-text-primary uppercase tracking-tight mb-4 px-2 md:px-0 text-center md:text-left">
                Behind the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-green-accent">Code</span>
              </h2>
            </div>

            {/* Mobile Profile Photo (Hero-style rounded avatar below title, mobile view only) */}
            {imageUrl && (
              <div className="flex md:hidden justify-center my-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-green-accent shadow-[0_0_25px_rgba(0,255,128,0.3)] shrink-0">
                  <img
                    src={imageUrl}
                    alt={imageAlt || "Profile"}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="bg-bg-card/40 border border-border-subtle/30 rounded-xl p-4 md:bg-transparent md:border-none md:p-0 md:rounded-none mb-10">
              <div className="prose prose-invert text-justify prose-p:text-text-primary prose-p:text-lg prose-p:font-semibold prose-p:leading-relaxed prose-p:text-justify prose-a:text-green-accent hover:prose-a:underline max-w-none transition-colors">
                <div dangerouslySetInnerHTML={{ __html: bioRichText }} />
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start px-2 md:px-0">
              <a
                href={cvUrl || "#"}
                target={cvUrl ? "_blank" : "_self"}
                rel="noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-accent text-bg-primary font-sans font-semibold rounded-full overflow-hidden transition-all hover:bg-green-accent/80 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,128,0.3)] text-center w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Download size={18} />
                  {cvUrl ? "Download Resume" : "Download Resume"}
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
