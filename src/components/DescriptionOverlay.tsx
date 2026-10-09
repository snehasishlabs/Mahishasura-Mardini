import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StorySegment } from '../types';
import { STORY_TIMELINE } from '../data/storyTimeline';

interface DescriptionOverlayProps {
  currentTime: number;
}

export const DescriptionOverlay: React.FC<DescriptionOverlayProps> = memo(({ currentTime }) => {
  // Hide description overlay when user reaches end of video story (scrolling into ending screen / About section)
  if (currentTime >= 90.0) {
    return null;
  }

  // Find single active description segment based on currentTime
  const activeSegment: StorySegment | undefined = STORY_TIMELINE.find(
    (segment) => currentTime >= segment.startTime && currentTime <= segment.endTime
  );

  // Position class helper: lower third of screen
  // Mobile: ALWAYS bottom-center with spacing above floating controls
  // Desktop (sm+): alternates left, right, center based on segment position
  const getPositionClasses = (position?: 'left' | 'right' | 'center') => {
    let base = "fixed bottom-20 left-3 right-3 sm:bottom-12 sm:left-6 sm:right-6 z-30 flex justify-center pointer-events-none transition-all duration-700 ease-out sm:px-8 ";

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
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg sm:max-w-xl p-4 sm:p-6 md:p-7 rounded-xl sm:rounded-2xl bg-black/65 sm:bg-black/55 backdrop-blur-sm sm:backdrop-blur-md border border-amber-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.9)] select-none text-center sm:text-left"
          >
            {/* Pure White Typography with High Readability & Soft Text Shadow */}
            <p className="text-base sm:text-xl md:text-2xl font-cinzel font-medium text-white leading-relaxed sm:leading-relaxed tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              {activeSegment.description}
            </p>

            {/* Optional Subtext if available */}
            {activeSegment.subText && (
              <p className="mt-2 text-[11px] sm:text-xs md:text-sm font-cinzel text-amber-200/90 tracking-widest uppercase border-t border-amber-500/20 pt-2 font-medium text-center sm:text-left">
                {activeSegment.subText}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});


