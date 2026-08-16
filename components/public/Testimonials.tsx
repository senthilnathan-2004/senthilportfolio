"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { MessageSquare, Quote, Star, Plus, X, Send, Loader2, ChevronRight } from "lucide-react";
import InfiniteCarousel from "./InfiniteCarousel";
import Image from "next/image";
import { submitPublicTestimonial } from "@/app/actions/publicActions";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
  rating: number;
  order: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function SlideToReviewButton({ onUnlock }: { onUnlock: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(200);
  const x = useMotionValue(0);
  // Fill width starts at 44px (full knob width) and expands with drag x
  const fillWidth = useTransform(x, (val) => `${Math.max(44, val + 44)}px`);
  const textOpacity = useTransform(x, [0, 80], [1, 0.1]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // total width - knob width (44px) - left padding (6px) - right padding (6px)
        const width = containerRef.current.offsetWidth - 44 - 12;
        const bounded = Math.max(width, 60);
        setMaxDrag(bounded);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Smooth idle nudge animation
  useEffect(() => {
    const controls = animate(x, [0, 16, 0], {
      duration: 1.8,
      repeat: Infinity,
      repeatDelay: 1.2,
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [x]);

  const handleDragStart = () => {
    x.stop();
  };

  const handleDragEnd = () => {
    if (x.get() >= maxDrag * 0.45) {
      onUnlock();
    }
    // Smoothly spring back to origin
    const springAnim = animate(x, 0, {
      type: "spring",
      stiffness: 450,
      damping: 32,
    });
    springAnim.then(() => {
      animate(x, [0, 16, 0], {
        duration: 1.8,
        repeat: Infinity,
        repeatDelay: 1.2,
        ease: "easeInOut",
      });
    });
  };

  return (
    <div
      ref={containerRef}
      onClick={onUnlock}
      className="group relative z-50 w-full h-14 bg-bg-card border border-green-accent/30 hover:border-green-accent/60 rounded-full p-1.5 flex items-center justify-between overflow-hidden cursor-pointer select-none transition-colors"
      role="button"
      tabIndex={0}
      aria-label="Slide to review"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onUnlock();
        }
      }}
    >
      {/* Dynamic green fill aligned with knob padding */}
      <motion.div
        className="absolute left-1.5 top-1.5 bottom-1.5 bg-green-accent/25 rounded-full pointer-events-none"
        style={{ width: fillWidth }}
      />

      {/* Centered label with smooth opacity fade */}
      <motion.span
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center font-mono text-xs sm:text-sm font-bold tracking-widest uppercase text-green-accent pl-10 pr-4 pointer-events-none"
      >
        SLIDE TO REVIEW
      </motion.span>

      {/* Draggable Knob */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="relative z-10 w-11 h-11 rounded-full bg-green-accent text-bg-primary flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0 touch-none shadow-[0_0_15px_rgba(140,255,158,0.35)] transition-shadow hover:shadow-[0_0_22px_rgba(140,255,158,0.55)]"
      >
        <ChevronRight size={20} className="stroke-[3] text-bg-primary pointer-events-none" />
      </motion.div>
    </div>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const sorted = [...testimonials].sort((a, b) => a.order - b.order);
  const testimonialNames = sorted.map(t => <span key={t._id} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">CLIENT_FEEDBACK</span>);

  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", quote: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitPublicTestimonial(formData);
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitted(false);
      setFormData({ name: "", role: "", quote: "", rating: 5 });
    }, 4000);
  };

  const reviewCards = sorted.map((testimonial, i) => (
    <div
      key={testimonial._id}
      className="w-[290px] sm:w-[380px] md:w-[420px] h-[250px] sm:h-[300px] md:h-[320px] p-4 sm:p-8 bg-bg-container/80 backdrop-blur-md border border-border-subtle rounded-3xl relative flex flex-col justify-between group hover:border-green-accent/30 transition-colors whitespace-normal text-left shrink-0"
    >
      <Quote className="absolute top-4 right-4 sm:top-8 sm:right-8 text-border-subtle group-hover:text-green-accent/20 transition-colors" size={32} />
      
      <div>
        <div className="flex gap-1 mb-3 sm:mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} className={i < testimonial.rating ? "text-green-accent fill-green-accent" : "text-text-tertiary"} />
          ))}
        </div>

        <div className="relative z-10 w-full">
          <p className="text-sm sm:text-base md:text-lg font-semibold text-text-primary text-justify leading-relaxed group-hover:text-green-accent transition-colors line-clamp-4 sm:line-clamp-5 w-full">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </div>
      </div>
      
      <div className="pt-3 sm:pt-6 border-t border-border-subtle/50 flex items-center gap-3 sm:gap-4">
        {testimonial.avatarUrl ? (
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-border-subtle shrink-0">
            <Image src={testimonial.avatarUrl} alt={testimonial.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-border-subtle flex items-center justify-center font-mono text-xs text-text-tertiary shrink-0">
            {testimonial.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h4 className="text-text-primary font-display tracking-tight text-sm sm:text-lg truncate">{testimonial.name}</h4>
          <p className="text-green-accent font-mono text-[10px] sm:text-xs uppercase tracking-widest truncate">{testimonial.role}</p>
        </div>
      </div>
    </div>
  ));

  return (
    <section id="testimonials" className="py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute top-[10%] left-0 w-full opacity-10 pointer-events-none">
        <InfiniteCarousel items={testimonialNames} speed="normal" direction="right" />
      </div>

      <div className="w-full mx-auto relative z-10">
        <div className="max-w-6xl mx-auto px-2 sm:px-8 mb-16 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-accent/5 border border-green-accent/20 text-sm text-green-accent mb-6 font-mono backdrop-blur-sm">
            <MessageSquare size={16} />
            <span className="tracking-widest uppercase">Client Feedback</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-text-primary uppercase tracking-tight mb-8">
            What They Say
          </h2>
          {/* Mobile View: Full-width Green Slide Button */}
          <div className="w-full sm:hidden px-2 max-w-sm">
            <SlideToReviewButton onUnlock={() => setIsModalOpen(true)} />
          </div>

          {/* Desktop & Tablet View: Standard Click Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-accent text-bg-primary font-bold hover:bg-[#50ff7a] transition-all hover:scale-105 active:scale-95 font-mono text-sm uppercase tracking-widest cursor-pointer"
          >
            <Plus size={16} />
            Add Review
          </button>
        </div>

        {/* The Carousel of Review Cards */}
        <div className="w-full relative pb-12 flex flex-col gap-6">
           <InfiniteCarousel items={reviewCards} speed="slow" direction="left" itemClassName="items-stretch" pauseOnHover={true} />
           <InfiniteCarousel items={[...reviewCards].reverse()} speed="slow" direction="right" itemClassName="items-stretch" pauseOnHover={true} />
        </div>
      </div>


      {/* Modal Form */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-2 py-4 sm:p-6" style={{ position: 'fixed' }}>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-bg-container/90 backdrop-blur-3xl border border-border-subtle rounded-3xl px-4 pt-4 pb-4 sm:px-8 sm:pt-6 sm:pb-6 max-h-[90vh] overflow-y-auto m-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {/* Glowing background inside card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" />

                {submitted ? (
                  <div className="py-12 text-center space-y-4 relative">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-0 right-0 text-text-tertiary hover:text-red-400 transition-colors z-10"
                    >
                      <X size={24} />
                    </button>
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-accent/10 border border-green-accent/30 flex items-center justify-center text-green-accent">
                      <Send size={32} />
                    </div>
                    <h3 className="text-2xl font-display text-text-primary">Transmission Sent</h3>
                    <p className="text-text-secondary font-sans">Your review has been securely delivered and is pending moderation.</p>
                  </div>
                ) : (
                  <>
                    <div className="sticky -top-4 sm:-top-6 z-20 bg-bg-container/95 backdrop-blur-2xl border-b border-border-subtle/50 pb-4 mb-6 flex items-center justify-between -mt-4 sm:-mt-6 -mx-4 sm:-mx-8 pt-4 sm:pt-6 px-4 sm:px-8 rounded-t-3xl">
                      <div>
                        <h3 className="text-xl font-mono text-text-primary uppercase tracking-wider mb-1">Submit Feedback</h3>
                        <p className="text-text-tertiary text-xs font-mono uppercase tracking-widest">Awaiting transmission...</p>
                      </div>
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-text-tertiary hover:text-red-400 transition-colors p-2 -mr-2"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-text-tertiary uppercase tracking-widest pl-2">Name</label>
                        <input
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-bg-primary/50 backdrop-blur-sm border border-border-subtle focus:border-green-accent/50 rounded-xl px-4 py-3 text-text-primary outline-none transition-all font-mono text-sm placeholder:text-text-tertiary"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-text-tertiary uppercase tracking-widest pl-2">Role / Company</label>
                        <input
                          required
                          value={formData.role}
                          onChange={e => setFormData({...formData, role: e.target.value})}
                          className="w-full bg-bg-primary/50 backdrop-blur-sm border border-border-subtle focus:border-green-accent/50 rounded-xl px-4 py-3 text-text-primary outline-none transition-all font-mono text-sm placeholder:text-text-tertiary"
                          placeholder="e.g. CEO at TechCorp"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono text-text-tertiary uppercase tracking-widest pl-2">Rating</label>
                        <div className="flex gap-3 pl-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                              type="button" 
                              key={star}
                              onClick={() => setFormData({...formData, rating: star})}
                              className={`focus:outline-none transition-all duration-300 hover:scale-125 ${star <= formData.rating ? '' : 'hover:text-green-accent/50'}`}
                            >
                              <Star 
                                size={28} 
                                className={star <= formData.rating ? "text-green-accent fill-green-accent" : "text-border-subtle"} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono text-text-tertiary uppercase tracking-widest pl-2">Review Content</label>
                        <textarea
                          required
                          rows={4}
                          value={formData.quote}
                          onChange={e => setFormData({...formData, quote: e.target.value})}
                          className="w-full bg-bg-primary/50 backdrop-blur-sm border border-border-subtle focus:border-green-accent/50 rounded-xl p-4 text-text-primary outline-none transition-all resize-none font-mono text-sm placeholder:text-text-tertiary leading-relaxed"
                          placeholder="Enter your feedback transmission..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-accent/10 border border-green-accent/30 text-green-accent font-mono tracking-widest text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-accent hover:text-bg-primary transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group/btn"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="animate-spin" size={18} /> UPLOADING...</>
                        ) : (
                          <><Send size={18} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" /> INITIATE TRANSFER</>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
