"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = "hidden";

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "";
          }, 500); // Wait a moment at 100% before sliding up
          return 100;
        }
        // Random increments for a more "real" terminal loading feel
        return prev + Math.floor(Math.random() * 15) + 5; 
      });
    }, 120);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[99999] bg-bg-primary flex flex-col items-center justify-center font-mono"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-green-accent/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-xs sm:max-w-md px-8 relative z-10">
            <div className="flex justify-between items-end mb-4 overflow-hidden">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-green-accent text-sm tracking-widest uppercase"
              >
                System Boot
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-text-primary text-2xl sm:text-3xl font-display"
              >
                {progress}%
              </motion.span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-[2px] w-full bg-border-subtle relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-green-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
            </div>

            {/* Terminal logs */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-col space-y-2 text-xs text-text-tertiary h-12"
            >
              <p>{progress < 30 ? "> Initializing core modules..." : progress < 70 ? "> Establishing secure connection..." : progress < 100 ? "> Loading user interface..." : "> Access granted."}</p>
              {progress > 40 && <p className="animate-pulse">&gt; Decrypting assets...</p>}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
