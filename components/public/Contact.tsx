"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Loader2, Sparkles, Terminal } from "lucide-react";
import InfiniteCarousel from "./InfiniteCarousel";

interface ContactProps {
  contactEmail?: string;
  contactLocation?: string;
  socialLinks?: Array<{ platform: string; url: string; order: number }>;
}

export default function Contact({ contactEmail, contactLocation, socialLinks }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const carouselItems = [
    <span key={1} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">ESTABLISH_CONNECTION</span>,
    <span key={2} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">SEND_TRANSMISSION</span>,
    <span key={3} className="text-sm font-bold tracking-widest uppercase font-mono text-text-tertiary">AVAILABLE_FOR_HIRE</span>,
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
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-accent/5 border border-green-accent/20 text-sm text-green-accent mb-6 font-mono backdrop-blur-sm">
            <Sparkles size={16} />
            <span className="tracking-widest uppercase">Let's Build Together</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-text-primary uppercase tracking-tight">
            Initiate Contact
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-8 items-stretch">
          
          {/* Left: Info Terminal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-8 h-full"
          >
            <div className="p-4 sm:p-6 bg-bg-container/60 backdrop-blur-xl border border-border-subtle rounded-3xl relative overflow-hidden group h-full flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border-subtle/50">
                <Terminal size={24} className="text-green-accent shrink-0" />
                <h3 className="text-lg sm:text-xl font-mono text-text-primary tracking-wide">System Status</h3>
              </div>
              
              <p className="text-text-secondary font-mono text-xs sm:text-sm leading-relaxed mb-8 sm:mb-10">
                &gt; Listening for incoming connections. <br/>
                &gt; Ready to process project require ments. <br/>
                &gt; Awaiting transmission.
              </p>

              <div className="space-y-6 sm:space-y-8">
                <a href={`mailto:${contactEmail || "hello@example.com"}`} className="flex items-center gap-3 sm:gap-4 group/link transition-opacity min-w-0 w-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-border-subtle/30 flex items-center justify-center text-green-accent group-hover/link:scale-110 group-hover/link:bg-green-accent/10 transition-all">
                    <Mail size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-[10px] sm:text-xs font-mono text-text-tertiary uppercase tracking-widest mb-1">Direct Line</p>
                    <p className="text-sm sm:text-base text-text-primary font-mono group-hover/link:text-green-accent transition-colors break-all">
                      {contactEmail || "hello@example.com"}
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-border-subtle/30 flex items-center justify-center text-text-secondary">
                    <MapPin size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-[10px] sm:text-xs font-mono text-text-tertiary uppercase tracking-widest mb-1">Base Coordinates</p>
                    <p className="text-sm sm:text-base text-text-primary font-mono break-words">{contactLocation || "Earth, Local Cluster"}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Premium Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-bg-container/40 backdrop-blur-xl border border-border-subtle rounded-3xl p-4 sm:p-6 lg:p-8 relative h-full flex flex-col justify-center"
          >
            {/* Glowing orb behind form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-full bg-green-accent/10 border border-green-accent/30 flex items-center justify-center text-green-accent">
                  <Send size={40} className="ml-2" />
                </div>
                <div>
                  <h3 className="text-3xl font-display text-text-primary mb-2">Transmission Sent</h3>
                  <p className="text-text-secondary font-sans text-lg">Your message has been securely delivered.</p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-6 py-3 rounded-full border border-border-subtle text-text-secondary font-mono text-sm hover:text-green-accent hover:border-green-accent/50 transition-colors"
                >
                  Send another transmission
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-2">
                      Identifier (Name)
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full bg-bg-primary/20 border border-border-subtle focus:border-green-accent/50 focus:ring-1 focus:ring-green-accent/50 rounded-xl p-3 sm:px-4 sm:py-4 text-text-primary outline-none transition-all font-sans placeholder:text-text-secondary/70"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-2">
                      Return Address (Email)
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full bg-bg-primary/20 border border-border-subtle focus:border-green-accent/50 focus:ring-1 focus:ring-green-accent/50 rounded-xl p-3 sm:px-4 sm:py-4 text-text-primary outline-none transition-all font-sans placeholder:text-text-secondary/70"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label htmlFor="message" className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-2">
                    Payload Content (Message)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-bg-primary/20 border border-border-subtle focus:border-green-accent/50 focus:ring-1 focus:ring-green-accent/50 rounded-xl p-3 sm:p-4 text-text-primary outline-none transition-all resize-none font-sans placeholder:text-text-secondary/70"
                    placeholder="Describe your project requirements here..."
                  />
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-mono border border-red-500/30 bg-red-500/10 p-4 rounded-xl">
                    [ERROR]: {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group overflow-hidden bg-green-accent text-bg-primary font-sans font-bold text-base sm:text-lg py-4 sm:py-5 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        UPLOADING...
                      </>
                    ) : (
                      <>
                        TRANSMIT DATA
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
