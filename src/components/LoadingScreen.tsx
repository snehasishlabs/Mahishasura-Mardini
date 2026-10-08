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
    }, 1200);

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
          className="fixed inset-0 z-50 flex flex-col items-center justify-between py-6 sm:py-10 overflow-hidden bg-[#0a090d] select-none"
          style={{ width: '100vw', height: '100vh', top: 0, left: 0 }}
        >
          {/* 1. Fullscreen Autumn Bengal Loading Background - Forced 100vw x 100vh Cover */}
          <div 
            className="absolute inset-0 z-0 overflow-hidden"
            style={{ width: '100vw', height: '100vh', top: 0, left: 0 }}
          >
            <img
              src="/loading-background.webp"
              alt="Autumn Bengal Atmosphere"
              style={{
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              className="opacity-80 scale-105 filter brightness-100 contrast-105 animate-pulse-subtle"
            />
            {/* Elegant warm golden atmospheric vignettes */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-[#0a090d] via-black/30 to-[#0a090d]/60"
              style={{ width: '100vw', height: '100vh' }} 
            />
            <div 
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.2)_0%,rgba(10,9,13,0.8)_85%)]"
              style={{ width: '100vw', height: '100vh' }}
            />
          </div>

          {/* Golden Ambient Particles */}
          <GoldenParticles density={window.innerWidth < 640 ? 30 : 70} />

          {/* Golden Light Burst Overlay on Click */}
          {isExpanding && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 4, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-40 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-100 blur-3xl opacity-90"
            />
          )}

          {/* Top Spacing / Subtitle Accent */}
          <div className="relative z-20 pt-4 sm:pt-6">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              className="text-xs sm:text-sm font-cinzel tracking-[0.3em] uppercase text-amber-200/90 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            >
              শ্রী শ্রী চণ্ডী পাঠ ও মহিষাসুরমর্দিনী
            </motion.span>
          </div>

          {/* Main Content Area */}
          <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center max-w-3xl w-full my-auto">
            
            {/* Centerpiece Lotus Container */}
            <div className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center mb-4 sm:mb-6">
              
              {/* Vibrant Golden-White Luminous Aura Disc behind Lotus */}
              <motion.div
                animate={{
                  scale: bloomed ? [1, 1.12, 1] : [0.95, 1, 0.95],
                  opacity: bloomed ? [0.9, 1, 0.9] : 0.8
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-40 h-40 sm:w-60 sm:h-60 md:w-68 md:h-68 rounded-full bg-gradient-to-br from-[#FFFBEB] via-[#FDE68A] to-[#F59E0B] blur-md shadow-[0_0_80px_rgba(251,191,36,0.9)]"
              />

              {/* 2. Initial Closed Lotus */}
              <motion.img
                src="/closed-lotus.png"
                alt="Closed Lotus"
                initial={{ opacity: 1, scale: 0.9 }}
                animate={{
                  opacity: bloomed ? 0 : 1,
                  scale: bloomed ? 1.1 : 0.95,
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{ mixBlendMode: 'multiply' }}
                className="absolute w-44 h-44 sm:w-64 sm:h-64 md:w-72 md:h-72 object-contain pointer-events-none filter contrast-125 brightness-110 drop-shadow-[0_0_30px_rgba(245,158,11,0.7)]"
              />

              {/* 3. Bloomed Open Lotus */}
              <motion.img
                src="/open-lotus.png"
                alt="Bloomed Lotus"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: bloomed ? 1 : 0,
                  scale: bloomed ? [1, 1.04, 1] : 0.85,
                }}
                transition={{
                  opacity: { duration: 1.6, ease: 'easeInOut' },
                  scale: bloomed ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : { duration: 1.5 }
                }}
                style={{ mixBlendMode: 'multiply' }}
                className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain pointer-events-none filter contrast-125 brightness-110 drop-shadow-[0_0_45px_rgba(251,191,36,0.9)]"
              />
            </div>

            {/* Title & Action Controls */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="flex flex-col items-center space-y-4 sm:space-y-6 w-full"
            >
              {/* Single Centered Responsive Title */}
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-cinzel tracking-wider text-center text-[#FFFDF7] drop-shadow-[0_0_35px_rgba(251,191,36,0.8)] select-none px-2 leading-tight">
                Mahishasura Mardini
              </h1>

              {/* Begin the Journey Button */}
              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(245, 158, 11, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-8 py-3.5 sm:px-10 sm:py-4 overflow-hidden rounded-full border border-amber-400/70 bg-gradient-to-r from-amber-950/95 via-amber-900 to-amber-950/95 text-amber-100 font-cinzel text-base sm:text-lg font-semibold tracking-wider shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-amber-300 hover:text-white cursor-pointer active:scale-95"
              >
                {/* Glowing Shimmer Effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-amber-400/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow group-hover:scale-110 transition-transform" />
                <span>Begin the Journey</span>
                <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>

          {/* Minimal Immersive Hint */}
          <div className="relative z-20 pb-2 sm:pb-4 text-[10px] sm:text-xs text-amber-300/70 font-cinzel tracking-[0.2em] sm:tracking-[0.3em] uppercase text-center px-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
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
          className="fixed inset-0 z-50 bg-[#0a090d] flex items-center justify-center pointer-events-none"
        >
          <div className="w-full h-full bg-gradient-to-b from-amber-500/20 via-amber-300/40 to-[#0a090d] blur-xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

