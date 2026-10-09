import { useState, useCallback, useEffect, useRef } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { StoryCanvasVideo } from './components/StoryCanvasVideo';
import { DescriptionOverlay } from './components/DescriptionOverlay';
import { AudioController } from './components/AudioController';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { FeedbackSection } from './components/FeedbackSection';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORY_TIMELINE } from './data/storyTimeline';

export function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showScrollHint, setShowScrollHint] = useState<boolean>(true);

  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const lastSegmentIdRef = useRef<number>(-1);
  const showScrollHintRef = useRef<boolean>(true);

  // Refresh GSAP ScrollTrigger when user starts journey
  useEffect(() => {
    if (hasStarted) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hasStarted]);

  // Callback when video timeline updates from scroll scrubbing
  const handleTimeUpdate = useCallback((time: number, progress: number) => {
    // Direct DOM update for smooth 60fps top progress bar (zero React re-render overhead)
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress * 100}%`;
    }

    // Toggle scroll hint state ONLY when crossing 3% threshold (zero per-frame re-renders)
    if (progress >= 0.03 && showScrollHintRef.current) {
      showScrollHintRef.current = false;
      setShowScrollHint(false);
    } else if (progress < 0.03 && !showScrollHintRef.current) {
      showScrollHintRef.current = true;
      setShowScrollHint(true);
    }

    // Hide floating description card ONLY when scrolling past 96s into the About section
    if (progress >= 0.995 || time >= 96.0) {
      if (lastSegmentIdRef.current !== 999) {
        lastSegmentIdRef.current = 999;
        setCurrentTime(999.0);
      }
      return;
    }

    // Update descriptions ONLY when entering a new timeline segment
    const segment = STORY_TIMELINE.find(
      (s) => time >= s.startTime && time <= s.endTime
    );

    if (segment && segment.id !== lastSegmentIdRef.current) {
      lastSegmentIdRef.current = segment.id;
      setCurrentTime(time);
    }
  }, []);

  // Callback when user clicks "Begin the Journey" on Loading Screen
  const handleStartJourney = () => {
    setHasStarted(true);
  };

  return (
    <main className="relative min-h-screen bg-[#0a090d] text-amber-50 font-cinzel overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Fullscreen Loading Screen */}
      {!hasStarted && (
        <LoadingScreen onStartJourney={handleStartJourney} />
      )}

      {/* 2. Floating Audio Controller */}
      <AudioController currentTime={currentTime} />

      {/* 3. Main Story Experience (Scroll Scrubbing Engine) */}
      <div className={`transition-opacity duration-1000 ${hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Subtle Top Journey Progress Bar - updated via direct DOM ref at 60fps */}
        <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-amber-950/40">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_10px_rgba(251,191,36,0.8)] transition-all duration-75 ease-out"
            style={{ width: '0%' }}
          />
        </div>

        {/* Scroll Prompt Visual Hint - Top position clear of lower-third description cards */}
        <AnimatePresence>
          {hasStarted && showScrollHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-14 sm:top-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-amber-300/80 pointer-events-none"
            >
              <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.25em] uppercase">Scroll to Experience Timeline</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-4 h-7 sm:w-5 sm:h-8 rounded-full border-2 border-amber-400/50 flex items-start justify-center p-1"
              >
                <div className="w-1 h-2 bg-amber-400 rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Story Multi-Video Scrubbing Engine (video1_opt.mp4, video2_opt.mp4, video3_opt.mp4 - 96s total) */}
        <StoryCanvasVideo
          duration={96}
          isActive={hasStarted}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Floating Lower-Third Narrative Description Overlay */}
        <DescriptionOverlay currentTime={currentTime} />

        {/* 4. About Section - Appears naturally after 96-second scroll story */}
        <AboutSection />

        {/* 5. Contact Section - Appears directly below About Section */}
        <ContactSection />

        {/* 6. Feedback Section - Embedded Jotform form immediately after Contact Section */}
        <FeedbackSection />
      </div>
    </main>
  );
}
export default App;
