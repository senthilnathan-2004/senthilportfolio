"use client";

import { motion } from "framer-motion";
import { Server } from "lucide-react";
import InfiniteCarousel from "./InfiniteCarousel";

interface Service {
  _id: string;
  title: string;
  description: string;
  iconName?: string;
  order: number;
}

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  const sorted = [...services].sort((a, b) => a.order - b.order);
  const serviceNames = sorted.map(s => <span key={s._id} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">{s.title.replace(" ", "_")}</span>);

  return (
    <section id="services" className="py-12 relative overflow-hidden">
      <div className="absolute top-[10%] left-0 w-full opacity-20 pointer-events-none">
        <InfiniteCarousel items={serviceNames} speed="slow" direction="right" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-2 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-accent/5 border border-green-accent/20 text-sm text-green-accent mb-6 font-mono backdrop-blur-sm">
            <Server size={16} />
            <span className="tracking-widest uppercase">Services</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-text-primary uppercase tracking-tight">
            What I Offer
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sorted.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative p-4 sm:p-5 bg-bg-card/70 backdrop-blur-xl border border-border-subtle hover:border-green-accent/40 hover:bg-bg-card rounded-2xl sm:rounded-3xl transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-accent/5 rounded-full blur-2xl group-hover:bg-green-accent/15 transition-all pointer-events-none" />

              <div>
                {/* Top Bar: Service Number Index & Status Dot */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-border-subtle/50">
                  <span className="font-mono text-xs text-green-accent font-semibold tracking-wider">
                    // 0{i + 1}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-accent/10 border border-green-accent/20 text-[10px] font-mono text-green-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-accent animate-pulse" />
                    <span>Specialization</span>
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-lg sm:text-xl font-display font-bold text-text-primary mb-2 tracking-tight group-hover:text-green-accent transition-colors leading-snug">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-sm sm:text-base font-semibold text-text-primary text-justify leading-relaxed font-mono w-full">
                  {service.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-border-subtle/40 flex items-center justify-between text-xs font-mono text-text-tertiary group-hover:text-green-accent transition-colors">
                <span className="text-[11px] tracking-wide">Enterprise Quality</span>
                <span className="text-green-accent group-hover:translate-x-1 transition-transform font-bold">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
