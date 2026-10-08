import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StoryCanvasVideoProps {
  onTimeUpdate: (currentTime: number, progress: number) => void;
  duration?: number;
  isActive?: boolean;
}

export const StoryCanvasVideo: React.FC<StoryCanvasVideoProps> = ({
  onTimeUpdate,
  duration = 96,
  isActive = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // 3 Multi-Video Refs
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const video3Ref = useRef<HTMLVideoElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Video Loaded Status States
  const [video1Loaded, setVideo1Loaded] = useState<boolean>(false);
  const [video2Loaded, setVideo2Loaded] = useState<boolean>(false);
  const [video3Loaded, setVideo3Loaded] = useState<boolean>(false);

  // Requirement 2: Staged Video Preloading (V1 immediate, V2 before 25%, V3 before 60%)
  const [shouldPreloadV2, setShouldPreloadV2] = useState<boolean>(false);
  const [shouldPreloadV3, setShouldPreloadV3] = useState<boolean>(false);

  // Active Video Index (0: video1 [0-32s], 1: video2 [32-63s], 2: video3 [63-96s])
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);

  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  // 1. Synchronize Video Loading & Preloading for all 3 videos
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    const v3 = video3Ref.current;

    if (v1) {
      const handleV1 = () => setVideo1Loaded(true);
      v1.addEventListener('canplaythrough', handleV1);
      v1.addEventListener('loadeddata', handleV1);
    }

    if (v2) {
      const handleV2 = () => setVideo2Loaded(true);
      v2.addEventListener('canplaythrough', handleV2);
      v2.addEventListener('loadeddata', handleV2);
    }

    if (v3) {
      const handleV3 = () => setVideo3Loaded(true);
      v3.addEventListener('canplaythrough', handleV3);
      v3.addEventListener('loadeddata', handleV3);
    }
  }, []);

  // 2. Setup GSAP ScrollTrigger Pinning timeline across 1200vh
  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;

    // Refresh ScrollTrigger after DOM renders
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      pin: viewport,
      pinSpacing: false, // Maintain 1200vh container height
      scrub: 0.05, // Ultra responsive scrub easing
      onUpdate: (self) => {
        const progress = self.progress; // 0.0 to 1.0
        const calculatedTime = progress * duration;
        targetTimeRef.current = calculatedTime;

        // Trigger staged video preloading before thresholds
        if (progress >= 0.12 && !shouldPreloadV2) {
          setShouldPreloadV2(true);
        }
        if (progress >= 0.40 && !shouldPreloadV3) {
          setShouldPreloadV3(true);
        }

        onTimeUpdate(calculatedTime, progress);
      }
    });

    return () => {
      clearTimeout(refreshTimer);
      scrollTriggerInstance.kill();
    };
  }, [duration, onTimeUpdate, isActive, shouldPreloadV2, shouldPreloadV3]);

  // 4. Procedural Canvas Story Scene Renderer
  const renderCanvasScene = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width || window.innerWidth;
    const height = canvas.height || window.innerHeight;

    // Requirement 6 & 7: Skip heavy canvas drawing cycles when active video is playing
    const activeVideoLoaded = (activeVideoIndex === 0 && video1Loaded) ||
                              (activeVideoIndex === 1 && video2Loaded) ||
                              (activeVideoIndex === 2 && video3Loaded);

    ctx.clearRect(0, 0, width, height);

    if (activeVideoLoaded) {
      // Draw simple solid dark background when video is active (zero canvas CPU draw overhead)
      ctx.fillStyle = '#0a090d';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // Background Gradient fallback when video is loading
    let bgGradient = ctx.createLinearGradient(0, 0, 0, height);

    if (time <= 9) {
      bgGradient.addColorStop(0, '#1E1B18');
      bgGradient.addColorStop(0.5, '#451A03');
      bgGradient.addColorStop(1, '#92400E');
    } else if (time > 9 && time <= 26) {
      bgGradient.addColorStop(0, '#0F0F12');
      bgGradient.addColorStop(0.5, '#450A0A');
      bgGradient.addColorStop(1, '#18181B');
    } else if (time > 26 && time <= 49) {
      bgGradient.addColorStop(0, '#1E1B18');
      bgGradient.addColorStop(0.4, '#78350F');
      bgGradient.addColorStop(0.8, '#B45309');
      bgGradient.addColorStop(1, '#FEF3C7');
    } else if (time > 49 && time <= 64) {
      bgGradient.addColorStop(0, '#450A0A');
      bgGradient.addColorStop(0.5, '#7F1D1D');
      bgGradient.addColorStop(1, '#991B1B');
    } else if (time > 64 && time <= 79) {
      bgGradient.addColorStop(0, '#0F172A');
      bgGradient.addColorStop(0.5, '#1E293B');
      bgGradient.addColorStop(1, '#334155');
    } else {
      bgGradient.addColorStop(0, '#18181B');
      bgGradient.addColorStop(0.5, '#581C87');
      bgGradient.addColorStop(1, '#451A03');
    }

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
  }, [activeVideoIndex, video1Loaded, video2Loaded, video3Loaded]);

  // 3. Smooth Master Timeline Lerp Loop for RAF Video & Canvas Seeking
  useEffect(() => {
    let animFrameId: number;

    const updateRender = () => {
      // Lerp master target time (0s to 96s)
      currentTimeRef.current += (targetTimeRef.current - currentTimeRef.current) * 0.2;
      const t = Math.max(0, Math.min(duration, currentTimeRef.current));

      let nextActiveIndex = 0;
      let localTime = 0;

      // Master Timeline Mapping:
      // Video 1 (0s to 32s, duration 32s) -> masterTime 0-32s
      // Video 2 (0s to 31s, duration 31s) -> masterTime 32-63s
      // Video 3 (0s to 33s, duration 33s) -> masterTime 63-96s
      if (t < 32) {
        nextActiveIndex = 0;
        localTime = t;
      } else if (t < 63) {
        nextActiveIndex = 1;
        localTime = t - 32;
      } else {
        nextActiveIndex = 2;
        localTime = t - 63;
      }

      setActiveVideoIndex(nextActiveIndex);

      // Seek active video & pre-seek adjacent videos for zero seek delay
      if (nextActiveIndex === 0 && video1Ref.current && video1Loaded) {
        if (Math.abs(video1Ref.current.currentTime - localTime) > 0.03) {
          try { video1Ref.current.currentTime = localTime; } catch { }
        }
        // Pre-seek Video 2 to 0s when approaching 32s boundary
        if (t > 26 && video2Ref.current && video2Loaded && video2Ref.current.currentTime !== 0) {
          try { video2Ref.current.currentTime = 0; } catch { }
        }
      } else if (nextActiveIndex === 1 && video2Ref.current && video2Loaded) {
        if (Math.abs(video2Ref.current.currentTime - localTime) > 0.03) {
          try { video2Ref.current.currentTime = localTime; } catch { }
        }
        // Pre-seek Video 1 to 32s when near boundary for backward scrolling
        if (t < 34 && video1Ref.current && video1Loaded && Math.abs(video1Ref.current.currentTime - 32) > 0.1) {
          try { video1Ref.current.currentTime = 32; } catch { }
        }
        // Pre-seek Video 3 to 0s when approaching 63s boundary
        if (t > 57 && video3Ref.current && video3Loaded && video3Ref.current.currentTime !== 0) {
          try { video3Ref.current.currentTime = 0; } catch { }
        }
      } else if (nextActiveIndex === 2 && video3Ref.current && video3Loaded) {
        if (Math.abs(video3Ref.current.currentTime - localTime) > 0.03) {
          try { video3Ref.current.currentTime = localTime; } catch { }
        }
        // Pre-seek Video 2 to 31s when near boundary for backward scrolling
        if (t < 65 && video2Ref.current && video2Loaded && Math.abs(video2Ref.current.currentTime - 31) > 0.1) {
          try { video2Ref.current.currentTime = 31; } catch { }
        }
      }

      // Render Canvas visual scene only when video is not active to save GPU
      renderCanvasScene(t);

      animFrameId = requestAnimationFrame(updateRender);
    };

    animFrameId = requestAnimationFrame(updateRender);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [duration, video1Loaded, video2Loaded, video3Loaded, renderCanvasScene]);

  const isAnyVideoLoaded = video1Loaded || video2Loaded || video3Loaded;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[1200vh] bg-[#0a090d]"
    >
      {/* GSAP ScrollTrigger Pinned Viewport (100vh Fullscreen) */}
      <div
        ref={viewportRef}
        className="w-full h-screen overflow-hidden flex items-center justify-center bg-[#0a090d]"
      >
        {/* Video 1 Element (0s - 32s) - Hardware Accelerated GPU Layer */}
        <video
          ref={video1Ref}
          src="/video1.mp4"
          playsInline
          muted
          preload="auto"
          style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${
            activeVideoIndex === 0 && video1Loaded ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        />

        {/* Video 2 Element (32s - 63s) - Preloaded at 15% Scroll */}
        <video
          ref={video2Ref}
          src="/video2.mp4"
          playsInline
          muted
          preload={shouldPreloadV2 || activeVideoIndex >= 1 ? "auto" : "metadata"}
          style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${
            activeVideoIndex === 1 && video2Loaded ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        />

        {/* Video 3 Element (63s - 96s) - Preloaded at 40% Scroll */}
        <video
          ref={video3Ref}
          src="/video3.mp4"
          playsInline
          muted
          preload={shouldPreloadV3 || activeVideoIndex >= 2 ? "auto" : "metadata"}
          style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${
            activeVideoIndex === 2 && video3Loaded ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        />

        {/* Fallback & Layered Canvas Visual Renderer */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
            isAnyVideoLoaded ? 'z-0 opacity-0' : 'z-20 opacity-100'
          }`}
        />
      </div>
    </div>
  );
};


