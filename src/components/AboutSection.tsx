import React from 'react';
import { motion } from 'framer-motion';

export const AboutSection: React.FC = () => {
  return (
    <section className="relative z-20 w-full min-h-screen bg-[#0a090d] text-amber-50 flex flex-col items-center justify-center py-28 sm:py-36 px-6 overflow-hidden select-none">
      {/* Subtle Soft Golden Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08)_0%,rgba(10,9,13,0.95)_75%)]" />

      {/* Main Center-Aligned Container */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center space-y-8"
      >
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-xs sm:text-sm font-cinzel font-semibold tracking-[0.35em] text-amber-400/85 uppercase"
        >
          A TRIBUTE TO BENGAL&apos;S SOUL
        </motion.span>

        {/* Decorative Minimal Line Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
        />

        {/* Paragraph 1 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl font-cinzel font-medium text-amber-50/90 leading-relaxed sm:leading-loose tracking-wide"
        >
          Mahishasura Mardini is a cinematic journey through the spirit of Durga Puja in Bengal—from the awakening of the Goddess and the triumph of good over evil to the devotion, artistry, and emotions that bring the festival to life.
        </motion.p>

        {/* Paragraph 2 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-base sm:text-lg md:text-xl font-cinzel font-medium text-amber-50/90 leading-relaxed sm:leading-loose tracking-wide pt-2"
        >
          Through sacred traditions, the hands of Kumartuli&apos;s artisans, and the final farewell along the Ganges, this experience celebrates a bond between Maa Durga and her children that transcends time.
        </motion.p>

        {/* Closing English Line & Bengali Staggered Reveal */}
        <div className="pt-8 flex flex-col items-center space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl font-cinzel italic text-amber-200/90 tracking-wide"
          >
            Because every farewell carries a promise.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.75 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bengali font-bold text-amber-400 tracking-normal drop-shadow-[0_0_20px_rgba(251,191,36,0.35)] pt-2"
          >
            আসছে বছর আবার হবে।
          </motion.h2>
        </div>
      </motion.div>
    </section>
  );
};
