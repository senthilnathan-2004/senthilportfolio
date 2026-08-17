"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone, Loader2, Sparkles, Briefcase, CheckCircle2, ExternalLink, Code2 } from "lucide-react";
import InfiniteCarousel from "./InfiniteCarousel";
import Link from "next/link";

interface ContactProps {
  contactEmail?: string;
  contactLocation?: string;
  contactPhone?: string;
  socialLinks?: Array<{ platform: string; url: string; order: number }>;
}

export default function Contact({ 
  contactEmail = "senthilragunathan2004@gmail.com", 
  contactLocation = "Chennai, Tamil Nadu, India",
  contactPhone = "+91-6374160496",
  socialLinks = []
}: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const carouselItems = [
    <span key={1} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">AVAILABLE_FOR_FULL_TIME_ROLES</span>,
    <span key={2} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">MERN_STACK_DEVELOPER</span>,
    <span key={3} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">READY_FOR_INTERVIEWS</span>,
    <span key={4} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">FULL_STACK_ENGINEERING</span>,
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (errorData?.details?.fieldErrors) {
          const firstError = Object.values(errorData.details.fieldErrors)[0] as string[];
          throw new Error(firstError[0] || "Invalid form data");
        }
        throw new Error(errorData?.error || "Failed to send message");
      }

      setSubmitted(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute top-[20%] left-0 w-full opacity-20 pointer-events-none -translate-y-1/2">
        <InfiniteCarousel items={carouselItems} speed="normal" direction="left" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-2 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-14 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-accent/5 border border-green-accent/20 text-sm text-green-accent mb-1.5 md:mb-3 font-mono backdrop-blur-sm">
            <Sparkles size={16} />
            <span className="tracking-widest uppercase">Career Opportunities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-text-primary uppercase tracking-tight whitespace-nowrap">
            Get In Touch
          </h2>
          <p className="font-mono text-text-secondary text-xs sm:text-sm max-w-lg mx-auto mt-2">
            Looking for a Full Stack MERN Developer? Let's discuss job openings, technical roles, or engineering collaborations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 items-stretch">
          
          {/* Left: Candidate Info & Direct Contacts */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-6 h-full"
          >
            <div className="p-6 sm:p-8 bg-bg-container/60 backdrop-blur-xl border border-border-subtle rounded-3xl relative overflow-hidden group h-full flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-subtle/50">
                  <div className="hidden sm:flex p-2 rounded-xl bg-green-accent/10 text-green-accent shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-mono font-bold text-text-primary uppercase tracking-wider">Hiring Status</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-green-accent">
                      <span className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
                      Actively Seeking Opportunities
                    </span>
                  </div>
                </div>
                
                <p className="text-text-secondary font-mono text-xs sm:text-sm leading-relaxed mb-6">
                  &gt; Full Stack MERN Developer ready for full-time engineering roles. <br/>
                  &gt; Open to on-site, hybrid, or remote positions. <br/>
                  &gt; Fast turnaround and response within 24 hours.
                </p>

                <div className="space-y-5">
                  <a href={`mailto:${contactEmail}`} className="flex items-center gap-3.5 group/link transition-opacity min-w-0 w-full">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-border-subtle/30 flex items-center justify-center text-green-accent group-hover/link:scale-110 group-hover/link:bg-green-accent/10 transition-all">
                      <Mail size={18} />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-[10px] sm:text-xs font-mono text-text-tertiary uppercase tracking-widest mb-0.5">Email Address</p>
                      <p className="text-xs sm:text-sm text-text-primary font-mono group-hover/link:text-green-accent transition-colors break-all">
                        {contactEmail}
                      </p>
                    </div>
                  </a>

                  <a href={`tel:${contactPhone.replace(/[^0-9+]/g, "")}`} className="flex items-center gap-3.5 group/link transition-opacity min-w-0 w-full">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-border-subtle/30 flex items-center justify-center text-green-accent group-hover/link:scale-110 group-hover/link:bg-green-accent/10 transition-all">
                      <Phone size={18} />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-[10px] sm:text-xs font-mono text-text-tertiary uppercase tracking-widest mb-0.5">Phone / WhatsApp</p>
                      <p className="text-xs sm:text-sm text-text-primary font-mono group-hover/link:text-green-accent transition-colors">
                        {contactPhone}
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3.5 min-w-0 w-full">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-border-subtle/30 flex items-center justify-center text-text-secondary">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-[10px] sm:text-xs font-mono text-text-tertiary uppercase tracking-widest mb-0.5">Location</p>
                      <p className="text-xs sm:text-sm text-text-primary font-mono">{contactLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profiles */}
              <div className="mt-8 pt-6 border-t border-border-subtle/50 flex items-center gap-3">
                <a
                  href="https://github.com/senthilnathan-2004"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-bg-card border border-border-subtle hover:border-green-accent/40 text-text-secondary hover:text-green-accent text-xs font-mono transition-all"
                >
                  <Code2 size={14} />
                  <span>GitHub</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>
                <a
                  href="https://linkedin.com/in/senthilnathan-r"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-bg-card border border-border-subtle hover:border-green-accent/40 text-text-secondary hover:text-green-accent text-xs font-mono transition-all"
                >
                  <Briefcase size={14} />
                  <span>LinkedIn</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Message Form for Recruiters & Hiring Managers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-bg-container/40 backdrop-blur-xl border border-border-subtle rounded-3xl p-5 sm:p-8 relative h-full flex flex-col justify-center"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full min-h-[380px] flex flex-col items-center justify-center text-center space-y-5"
              >
                <div className="w-20 h-20 rounded-full bg-green-accent/10 border border-green-accent/30 flex items-center justify-center text-green-accent">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display text-text-primary mb-2">Message Received</h3>
                  <p className="text-text-secondary font-sans text-sm sm:text-base max-w-sm">
                    Thank you for reaching out! I will review your message and get back to you promptly.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full border border-border-subtle text-text-secondary font-mono text-xs hover:text-green-accent hover:border-green-accent/50 transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <h3 className="font-mono text-sm font-semibold text-text-primary uppercase tracking-wider mb-1">Send a Message</h3>
                  <p className="font-mono text-xs text-text-tertiary">Recruiters, hiring teams, and engineers are welcome.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-1">
                      Your Name / Company
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full bg-bg-primary/20 border border-border-subtle focus:border-green-accent/50 focus:ring-1 focus:ring-green-accent/50 rounded-xl p-3 sm:p-3.5 text-text-primary outline-none transition-all font-sans text-sm placeholder:text-text-secondary/60"
                      placeholder="e.g. Sarah Connor / Tech Corp"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-1">
                      Your Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full bg-bg-primary/20 border border-border-subtle focus:border-green-accent/50 focus:ring-1 focus:ring-green-accent/50 rounded-xl p-3 sm:p-3.5 text-text-primary outline-none transition-all font-sans text-sm placeholder:text-text-secondary/60"
                      placeholder="e.g. sarah@techcorp.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-1">
                    Message / Job Opportunity Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-bg-primary/20 border border-border-subtle focus:border-green-accent/50 focus:ring-1 focus:ring-green-accent/50 rounded-xl p-3 sm:p-3.5 text-text-primary outline-none transition-all resize-none font-sans text-sm placeholder:text-text-secondary/60"
                    placeholder="Hi Senthilnathan, we have an exciting Full Stack / Software Engineer opportunity and would like to connect..."
                  />
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-mono border border-red-500/30 bg-red-500/10 p-3 rounded-xl">
                    [ERROR]: {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group overflow-hidden bg-green-accent text-bg-primary font-sans font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2.5 disabled:opacity-50 mt-2 transition-all hover:bg-green-accent/90"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        SENDING MESSAGE...
                      </>
                    ) : (
                      <>
                        SEND MESSAGE
                        <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
