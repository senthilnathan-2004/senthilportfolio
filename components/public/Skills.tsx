"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";
import InfiniteCarousel from "./InfiniteCarousel";
import Image from "next/image";

interface Skill {
  _id: string;
  name: string;
  iconUrl: string;
  level: number;
  order: number;
  category: string;
}

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  const sorted = [...skills].sort((a, b) => a.order - b.order);
  const categories = Array.from(new Set(sorted.map(s => s.category || "Frontend")));
  
  const [activeTab, setActiveTab] = useState(categories[0] || "Frontend");

  const skillNames = skills.map(s => <span key={s._id} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">{s.name}</span>);
  const activeSkills = sorted.filter(s => (s.category || "Frontend") === activeTab);

  return (
    <section id="skills" className="py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full opacity-20 pointer-events-none -translate-y-1/2">
        <InfiniteCarousel items={skillNames} speed="normal" direction="left" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-2 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-12 lg:mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-accent/5 border border-green-accent/20 text-sm text-green-accent mb-3 sm:mb-6 font-mono backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,128,0.1)]">
            <Layers size={16} />
            <span className="tracking-widest uppercase">Tech Arsenal</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-text-primary uppercase tracking-tight">
            Tools I Work With
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="w-full relative flex justify-center mb-8 sm:mb-12">
          {/* Mobile Scroll Fade Indicators */}
          <div className="sm:hidden absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-primary via-bg-primary/80 to-transparent pointer-events-none z-20" />
          <div className="sm:hidden absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none z-20" />

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1.5 px-4 sm:px-0 sm:flex-wrap sm:justify-center scroll-smooth snap-x snap-mandatory touch-pan-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((category) => (
              <button
                key={category}
                onClick={(e) => {
                  setActiveTab(category);
                  e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                }}
                className={`relative px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-mono text-xs sm:text-sm uppercase tracking-widest transition-colors duration-300 shrink-0 whitespace-nowrap snap-center ${
                  activeTab === category ? "text-bg-primary font-bold" : "text-text-secondary hover:text-text-primary bg-bg-card/40 sm:bg-transparent border border-border-subtle/40 sm:border-none"
                }`}
              >
                {activeTab === category && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-green-accent rounded-full -z-10 shadow-[0_0_20px_rgba(0,255,128,0.3)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeSkills.map((skill, i) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-5 bg-bg-container/40 backdrop-blur-md border border-border-subtle rounded-2xl hover:border-green-accent/40 transition-colors group shadow-card"
              >
                {skill.iconUrl ? (
                  <div className="w-12 h-12 shrink-0 relative group-hover:scale-110 transition-transform duration-300">
                    <Image src={skill.iconUrl} alt={skill.name} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 shrink-0 bg-border-subtle rounded-xl flex items-center justify-center font-mono text-sm text-text-tertiary group-hover:bg-green-accent/20 group-hover:text-green-accent transition-colors">
                    {skill.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0 flex items-center">
                  <h4 className="text-lg font-semibold text-text-primary group-hover:text-green-accent transition-colors truncate">
                    {skill.name}
                  </h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
