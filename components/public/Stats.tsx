"use client";

import { motion } from "framer-motion";

interface Stat {
  _id: string;
  label: string;
  number: string;
  order: number;
}

interface StatsProps {
  stats: Stat[];
}

export default function Stats({ stats }: StatsProps) {
  const sorted = [...stats].sort((a, b) => a.order - b.order);

  return (
    <section id="stats" className="py-8 relative z-20">
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-y-8 gap-x-6 p-6 md:flex md:flex-row md:items-center md:justify-between md:gap-8 lg:p-8 bg-bg-container/60 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-card"
        >
          {sorted.map((stat, i) => (
            <div key={stat._id} className="flex flex-col items-start justify-start text-left w-full md:flex-1 md:border-r border-border-subtle/50 md:pr-6 last:border-0 last:pr-0">
              <span className="text-4xl md:text-5xl font-mono font-bold text-text-primary tracking-tight mb-2 md:mb-3">
                <span className="text-green-accent">_</span>{stat.number}
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm font-mono text-text-secondary uppercase tracking-wider md:tracking-widest max-w-[140px] md:max-w-none">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
