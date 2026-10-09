import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StorySegment } from '../types';
import { STORY_TIMELINE } from '../data/storyTimeline';

interface DescriptionOverlayProps {
  currentTime: number;
}

export const DescriptionOverlay: React.FC<DescriptionOverlayProps> = memo(({ currentTime }) => {
  // Hide description overlay when user finishes the 96s video story and scrolls into About section
  if (currentTime >= 96.0) {
    return null;
  }

  // Find single active description segment based on currentTime
  const activeSegment: StorySegment | undefined = STORY_TIMELINE.find(
    (segment) => currentTime >= segment.startTime && currentTime <= segment.endTime
  );

  // Position class helper: lower third of screen
  // Mobile: ALWAYS bottom-center with safe distance above floating audio controls
  // Desktop (sm+): alternates left, right, center based on segment position
  const getPositionClasses = (position?: 'left' | 'right' | 'center') => {
    let base = "fixed bottom-20 left-3 right-3 sm:bottom-12 sm:left-6 sm:right-6 z-30 flex justify-center pointer-events-none transition-all duration-500 ease-out sm:px-8 ";

    if (position === 'left') {
      base += "sm:justify-start";
    } else if (position === 'right') {
      base += "sm:justify-end";
    } else {
      base += "sm:justify-center";
    }

    return base;
  };

  return (
    <div className={getPositionClasses(activeSegment?.position)}>
      <AnimatePresence mode="wait">
        {activeSegment && (
          <motion.div
            key={activeSegment.id}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md sm:max-w-xl px-4 py-3.5 sm:p-6 md:p-7 rounded-xl sm:rounded-2xl bg-black/80 sm:bg-black/60 backdrop-blur-none sm:backdrop-blur-md border border-amber-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.9)] select-none text-center sm:text-left"
          >
            {/* Pure White Typography with High Readability & Soft Text Shadow */}
            <p className="text-sm sm:text-xl md:text-2xl font-cinzel font-medium text-white leading-relaxed sm:leading-relaxed tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              {activeSegment.description}
            </p>

            {/* Optional Subtext if available */}
            {activeSegment.subText && (
              <p className="mt-2 text-[10px] sm:text-xs md:text-sm font-cinzel text-amber-200/90 tracking-widest uppercase border-t border-amber-500/20 pt-2 font-medium text-center sm:text-left">
                {activeSegment.subText}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
