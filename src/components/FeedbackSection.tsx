import React from 'react';
import { motion } from 'framer-motion';

export const FeedbackSection: React.FC = () => {
  return (
    <section className="relative z-20 w-full bg-[#0a090d] text-amber-50 flex flex-col items-center justify-center py-16 sm:py-24 px-4 sm:px-6 overflow-hidden select-none border-t border-amber-500/10">
      {/* Subtle Warm Golden Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.06)_0%,transparent_75%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-6"
      >
        {/* Section Heading */}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-xs sm:text-sm font-cinzel font-semibold tracking-[0.35em] text-amber-400/85 uppercase">
            FEEDBACK
          </span>

          <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-[#FFFDF7] tracking-wider drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            Share Your Feedback
          </h2>

          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent my-1" />

          <p className="text-sm sm:text-base md:text-lg font-cinzel font-medium text-amber-100/80 leading-relaxed max-w-xl px-2">
            Your thoughts matter. Share your experience and help make this journey even better.
          </p>
        </div>

        {/* Embedded Jotform Form Container */}
        <div className="w-full mt-4 p-2 sm:p-4 rounded-2xl bg-black/60 border border-amber-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-md overflow-hidden">
          <iframe
            id="JotFormIFrame-262812860157055"
            title="Share Your Feedback"
            src="https://form.jotform.com/262812860157055"
            allow="geolocation; microphone; camera; fullscreen"
            className="w-full border-none rounded-xl min-h-[540px] sm:min-h-[580px]"
            style={{ width: '100%', minWidth: '100%', height: '560px', border: 'none' }}
          />
        </div>
      </motion.div>
    </section>
  );
};
