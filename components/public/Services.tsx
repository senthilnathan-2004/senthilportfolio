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

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-accent/5 border border-green-accent/20 text-sm text-green-accent mb-6 font-mono backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,128,0.1)]">
            <Server size={16} />
            <span className="tracking-widest uppercase">Services</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-text-primary uppercase tracking-tight">
            What I Offer
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-bg-container/40 backdrop-blur-md border border-border-subtle rounded-3xl hover:border-green-accent/30 hover:bg-bg-container/80 transition-all duration-300 group shadow-card flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-border-subtle/50 rounded-2xl flex items-center justify-center mb-6 text-green-accent group-hover:scale-110 transition-transform duration-300">
                <Server size={24} />
              </div>
              <h3 className="text-xl font-display text-text-primary mb-4 tracking-tight">
                {service.title}
              </h3>
              <p className="text-lg font-semibold text-text-primary group-hover:text-green-accent transition-colors leading-relaxed mt-auto">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
