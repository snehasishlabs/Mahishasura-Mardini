import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoldenParticles } from './GoldenParticles';
import { Sparkles, Play } from 'lucide-react';
import { playChandiPathDirectly } from '../utils/audioManager';

interface LoadingScreenProps {
  onStartJourney: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onStartJourney }) => {
  const [bloomed, setBloomed] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    // Lotus blooming transition timing
    const timer = setTimeout(() => {
      setBloomed(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    // 1. Invoke audio.play() directly inside user click event handler
    playChandiPathDirectly();

    // 2. Notify parent application
    onStartJourney();

    // 3. Start loading screen transitions ONLY AFTER audio.play() has been invoked
    setIsExpanding(true);
  };

  return (
    <AnimatePresence>
      {!isExpanding ? (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 h-[100dvh] z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0a090d] select-none"
        >
          {/* 1. Fullscreen Autumn Bengal Loading Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="/loading-background.webp"
              alt="Autumn Bengal Atmosphere"
              className="w-full h-full object-cover opacity-75 scale-105 filter brightness-95 contrast-105 animate-pulse-subtle"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a090d] via-black/30 to-[#0a090d]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.18)_0%,rgba(10,9,13,0.85)_75%)]" />
          </div>

          {/* Golden Ambient Particles - lighter on mobile */}
          <GoldenParticles density={window.innerWidth < 640 ? 25 : 65} />

          {/* Golden Light Burst Overlay on Click */}
          {isExpanding && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 4, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-40 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-100 blur-3xl opacity-90"
            />
          )}

          {/* Main Content Area */}
          <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center max-w-3xl w-full">
            
            {/* Centerpiece Lotus Container with Blend Mode */}
            <div className="relative w-44 h-44 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center mb-3 sm:mb-6">
              
              {/* Subtle Golden Radial Glow Effect */}
              <motion.div
                animate={{
                  scale: bloomed ? [1, 1.12, 1] : [0.95, 1, 0.95],
                  opacity: bloomed ? [0.6, 0.9, 0.6] : 0.4
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-2 sm:inset-4 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.35)_0%,transparent_70%)] blur-xl"
              />

              {/* 2. Initial Closed Lotus (crossfades & scales out) */}
              <motion.img
                src="/closed-lotus.png"
                alt="Closed Lotus"
                initial={{ opacity: 1, scale: 0.9 }}
                animate={{
                  opacity: bloomed ? 0 : 1,
                  scale: bloomed ? 1.1 : 0.95,
                }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                style={{ mixBlendMode: 'multiply' }}
                className="absolute w-36 h-36 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain pointer-events-none filter contrast-125 brightness-110 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"
              />

              {/* 3. Bloomed Open Lotus (crossfades & scales in with golden glow) */}
              <motion.img
                src="/open-lotus.png"
                alt="Bloomed Lotus"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: bloomed ? 1 : 0,
                  scale: bloomed ? [1, 1.04, 1] : 0.85,
                }}
                transition={{
                  opacity: { duration: 2, ease: 'easeInOut' },
                  scale: bloomed ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : { duration: 1.8 }
                }}
                style={{ mixBlendMode: 'multiply' }}
                className="absolute w-40 h-40 sm:w-72 sm:h-72 md:w-88 md:h-88 object-contain pointer-events-none filter contrast-125 brightness-110 drop-shadow-[0_0_35px_rgba(251,191,36,0.7)]"
              />
            </div>

            {/* 5. Title & 6. Button Reveal Sequence */}
            <AnimatePresence>
              {bloomed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="flex flex-col items-center space-y-3 sm:space-y-6 w-full"
                >
                  {/* Single Centered Responsive Title */}
                  <h1 className="text-xl sm:text-5xl md:text-7xl font-bold font-cinzel tracking-wider text-center text-[#FFFDF7] drop-shadow-[0_0_25px_rgba(251,191,36,0.5)] select-none px-2 leading-tight">
                    Mahishasura Mardini
                  </h1>

                  {/* Begin the Journey Button */}
                  <motion.button
                    onClick={handleStart}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(245, 158, 11, 0.6)' }}
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, delay: 0.8 }}
                    className="group relative inline-flex items-center gap-2 sm:gap-3 px-5 py-3 sm:px-9 sm:py-4 overflow-hidden rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-950/80 via-amber-900/90 to-amber-950/80 text-amber-100 font-cinzel text-xs sm:text-lg font-semibold tracking-wider shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-amber-300 hover:text-white cursor-pointer active:scale-95 min-h-[44px]"
                  >
                    {/* Glowing Shimmer Effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-amber-400/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin-slow group-hover:scale-110 transition-transform" />
                    <span>Begin the Journey</span>
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Minimal Immersive Hint */}
          <div className="absolute bottom-3 sm:bottom-6 text-[9px] sm:text-xs text-amber-400/40 font-cinzel tracking-[0.2em] sm:tracking-[0.3em] uppercase text-center px-4">
            Scroll To Control The Celestial Timeline
          </div>
        </motion.div>
      ) : (
        /* Smooth Fade Out Reveal Mask */
        <motion.div
          key="light-expanding-mask"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="fixed inset-0 h-[100dvh] z-50 bg-[#0a090d] flex items-center justify-center pointer-events-none"
        >
          <div className="w-full h-full bg-gradient-to-b from-amber-500/20 via-amber-300/40 to-[#0a090d] blur-xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
