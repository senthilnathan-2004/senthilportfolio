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
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 p-6 lg:p-8 bg-bg-container/60 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-card"
        >
          {sorted.map((stat, i) => (
            <div key={stat._id} className="flex flex-col items-center md:items-start text-center md:text-left flex-1 border-b md:border-b-0 md:border-r border-border-subtle/50 last:border-0 pb-6 md:pb-0 md:pr-6 last:pr-0">
              <span className="text-4xl md:text-5xl font-display text-text-primary tracking-tighter mb-2">
                {stat.number}
              </span>
              <span className="text-sm font-sans text-text-secondary font-medium tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
