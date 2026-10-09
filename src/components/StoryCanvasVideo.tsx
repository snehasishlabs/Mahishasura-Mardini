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

  // Active video index ref to eliminate 60 FPS React re-renders during scroll
  const activeVideoIndexRef = useRef<number>(0);
  const isTouchDeviceRef = useRef<boolean>(false);

  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  // Detect touch device capabilities once on mount
  useEffect(() => {
    isTouchDeviceRef.current =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
  }, []);

  // Helper to update video DOM visibility directly without triggering React re-renders
  const updateVideoDOMVisibility = useCallback((activeIndex: number) => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    const v3 = video3Ref.current;

    if (v1) {
      v1.style.opacity = activeIndex === 0 ? '1' : '0';
      v1.style.zIndex = activeIndex === 0 ? '10' : '0';
    }
    if (v2) {
      v2.style.opacity = activeIndex === 1 ? '1' : '0';
      v2.style.zIndex = activeIndex === 1 ? '10' : '0';
    }
    if (v3) {
      v3.style.opacity = activeIndex === 2 ? '1' : '0';
      v3.style.zIndex = activeIndex === 2 ? '10' : '0';
    }
  }, []);

  // 1. Synchronize Video Preloading & Initial Frame Warmup
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    const v3 = video3Ref.current;

    const setupVideoListeners = (
      v: HTMLVideoElement | null,
      setLoaded: (val: boolean) => void
    ) => {
      if (!v) return;

      const handleReady = () => {
        setLoaded(true);
        // Pre-seek 0.001s to warm up GPU decoder texture for initial frame
        if (v.currentTime === 0) {
          try {
            v.currentTime = 0.001;
          } catch { }
        }
      };

      v.addEventListener('loadedmetadata', handleReady);
      v.addEventListener('canplay', handleReady);
      v.addEventListener('loadeddata', handleReady);

      if (v.readyState >= 1) {
        handleReady();
      }
    };

    setupVideoListeners(v1, setVideo1Loaded);
    setupVideoListeners(v2, setVideo2Loaded);
    setupVideoListeners(v3, setVideo3Loaded);
  }, []);

  // 2. Setup GSAP ScrollTrigger Pinning timeline across 1200vh
  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport || !isActive) return;

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      pin: viewport,
      pinSpacing: false,
      // Minimal scrub lag on touch to closely follow user finger movements
      scrub: isTouchDeviceRef.current ? 0.01 : 0.05,
      onUpdate: (self) => {
        const progress = self.progress;
        const calculatedTime = progress * duration;
        targetTimeRef.current = calculatedTime;
        onTimeUpdate(calculatedTime, progress);
      }
    });

    return () => {
      clearTimeout(refreshTimer);
      scrollTriggerInstance.kill();
    };
  }, [duration, onTimeUpdate, isActive]);

  // 4. Canvas Fallback Renderer for initial load
  const renderCanvasScene = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width || window.innerWidth;
    const height = canvas.height || window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
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
  }, []);

  // Helper for performing efficient non-thrashing video seeking
  const safeSeek = useCallback((video: HTMLVideoElement | null, targetLocalTime: number) => {
    if (!video || video.seeking) return;
    const seekThreshold = isTouchDeviceRef.current ? 0.05 : 0.04;
    if (Math.abs(video.currentTime - targetLocalTime) > seekThreshold) {
      try {
        if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
          (video as any).fastSeek(targetLocalTime);
        } else {
          video.currentTime = targetLocalTime;
        }
      } catch { }
    }
  }, []);

  // 3. Smooth Master Timeline Lerp Loop for RAF Video & Canvas Seeking
  useEffect(() => {
    let animFrameId: number;

    const updateRender = () => {
      // Lerp master target time (0s to 96s)
      // Faster lerp factor (0.45) on touch devices to follow finger touch swiping smoothly
      const lerpFactor = isTouchDeviceRef.current ? 0.45 : 0.25;
      currentTimeRef.current += (targetTimeRef.current - currentTimeRef.current) * lerpFactor;
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

      // Update DOM visibility directly if index changed (zero React re-render overhead)
      if (activeVideoIndexRef.current !== nextActiveIndex) {
        activeVideoIndexRef.current = nextActiveIndex;
        updateVideoDOMVisibility(nextActiveIndex);
      }

      // Seek active video & pre-seek adjacent videos for zero seek delay
      if (nextActiveIndex === 0 && video1Ref.current && video1Loaded) {
        safeSeek(video1Ref.current, localTime);
        // Pre-seek Video 2 to 0s when approaching 32s boundary
        if (t > 25 && video2Ref.current && video2Loaded && video2Ref.current.currentTime !== 0) {
          safeSeek(video2Ref.current, 0.001);
        }
      } else if (nextActiveIndex === 1 && video2Ref.current && video2Loaded) {
        safeSeek(video2Ref.current, localTime);
        // Pre-seek Video 1 to 32s when near boundary for backward scrolling
        if (t < 34 && video1Ref.current && video1Loaded && Math.abs(video1Ref.current.currentTime - 32) > 0.1) {
          safeSeek(video1Ref.current, 32);
        }
        // Pre-seek Video 3 to 0s when approaching 63s boundary
        if (t > 56 && video3Ref.current && video3Loaded && video3Ref.current.currentTime !== 0) {
          safeSeek(video3Ref.current, 0.001);
        }
      } else if (nextActiveIndex === 2 && video3Ref.current && video3Loaded) {
        safeSeek(video3Ref.current, localTime);
        // Pre-seek Video 2 to 31s when near boundary for backward scrolling
        if (t < 65 && video2Ref.current && video2Loaded && Math.abs(video2Ref.current.currentTime - 31) > 0.1) {
          safeSeek(video2Ref.current, 31);
        }
      }

      // Only render canvas fallback when active video is not loaded (saves GPU cycles)
      const activeLoaded =
        (activeVideoIndexRef.current === 0 && video1Loaded) ||
        (activeVideoIndexRef.current === 1 && video2Loaded) ||
        (activeVideoIndexRef.current === 2 && video3Loaded);

      if (!activeLoaded) {
        renderCanvasScene(t);
      }

      animFrameId = requestAnimationFrame(updateRender);
    };

    animFrameId = requestAnimationFrame(updateRender);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [duration, video1Loaded, video2Loaded, video3Loaded, renderCanvasScene, safeSeek, updateVideoDOMVisibility]);

  const isAnyVideoLoaded = video1Loaded || video2Loaded || video3Loaded;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[1200vh] bg-[#0a090d]"
    >
      {/* GSAP ScrollTrigger Pinned Viewport (Support dynamic 100dvh on mobile) */}
      <div
        ref={viewportRef}
        className="w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center bg-[#0a090d]"
      >
        {/* Video 1 Element (0s - 32s) - Hardware Accelerated GPU Layer */}
        <video
          ref={video1Ref}
          src="/video1.mp4"
          playsInline
          muted
          preload="auto"
          style={{ willChange: 'opacity', transform: 'translateZ(0)', opacity: 1, zIndex: 10 }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ease-out pointer-events-none"
        />

        {/* Video 2 Element (32s - 63s) - Eagerly Preloaded */}
        <video
          ref={video2Ref}
          src="/video2.mp4"
          playsInline
          muted
          preload="auto"
          style={{ willChange: 'opacity', transform: 'translateZ(0)', opacity: 0, zIndex: 0 }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ease-out pointer-events-none"
        />

        {/* Video 3 Element (63s - 96s) - Eagerly Preloaded */}
        <video
          ref={video3Ref}
          src="/video3.mp4"
          playsInline
          muted
          preload="auto"
          style={{ willChange: 'opacity', transform: 'translateZ(0)', opacity: 0, zIndex: 0 }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ease-out pointer-events-none"
        />

        {/* Fallback & Layered Canvas Visual Renderer */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            isAnyVideoLoaded ? 'z-0 opacity-0' : 'z-20 opacity-100'
          }`}
        />
      </div>
    </div>
  );
};
