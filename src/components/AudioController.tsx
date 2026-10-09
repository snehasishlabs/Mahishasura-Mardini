import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { spiritualAudioEngine } from '../utils/audioSynth';
import { getChandiAudioInstance } from '../utils/audioManager';

interface AudioControllerProps {
  audioSrc?: string;
  autoStart?: boolean;
  currentTime?: number; // Real-time story video timeline position (0 to 96s)
}

export const AudioController: React.FC<AudioControllerProps> = ({
  currentTime = 0
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const fadeIntervalRef = useRef<number | null>(null);

  // Synchronize audio state with global preloaded Chandi Path audio instance
  useEffect(() => {
    const audio = getChandiAudioInstance();
    if (!audio) return;

    const updateState = () => {
      setIsPlaying(!audio.paused && !audio.ended);
      setIsMuted(audio.muted);
    };

    updateState();

    audio.addEventListener('play', updateState);
    audio.addEventListener('pause', updateState);
    audio.addEventListener('ended', updateState);
    audio.addEventListener('volumechange', updateState);

    return () => {
      audio.removeEventListener('play', updateState);
      audio.removeEventListener('pause', updateState);
      audio.removeEventListener('ended', updateState);
      audio.removeEventListener('volumechange', updateState);
    };
  }, []);

  // Modulate Web Audio Synth fallback based on story time
  useEffect(() => {
    spiritualAudioEngine.updateMoodForTime(currentTime);
  }, [currentTime]);

  // Smooth Volume Fade In (over 1s)
  const fadeInVolume = (targetVolume = 1.0, durationMs = 1000) => {
    const audio = getChandiAudioInstance();
    if (!audio) return;

    if (fadeIntervalRef.current) {
      cancelAnimationFrame(fadeIntervalRef.current);
    }

    audio.volume = 0;
    const startTime = performance.now();

    const fadeStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      audio.volume = progress * targetVolume;

      if (progress < 1) {
        fadeIntervalRef.current = requestAnimationFrame(fadeStep);
      }
    };

    fadeIntervalRef.current = requestAnimationFrame(fadeStep);
  };

  // Smooth Volume Fade Out (over 1s) before pausing
  const fadeOutVolume = (durationMs = 1000, onComplete?: () => void) => {
    const audio = getChandiAudioInstance();
    if (!audio) {
      if (onComplete) onComplete();
      return;
    }

    if (fadeIntervalRef.current) {
      cancelAnimationFrame(fadeIntervalRef.current);
    }

    const initialVolume = audio.volume;
    const startTime = performance.now();

    const fadeStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      audio.volume = Math.max(0, initialVolume * (1 - progress));

      if (progress < 1) {
        fadeIntervalRef.current = requestAnimationFrame(fadeStep);
      } else {
        if (onComplete) onComplete();
      }
    };

    fadeIntervalRef.current = requestAnimationFrame(fadeStep);
  };

  // Play Audio logic (resumes from current timestamp)
  const playAudio = () => {
    const audio = getChandiAudioInstance();
    if (audio) {
      fadeInVolume(1.0, 1000);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error("Manual playback failed", err);
        });
      }
    }
    spiritualAudioEngine.start();
  };

  // Pause Audio logic with 1s fade-out (remains at exact pause timestamp)
  const pauseAudio = () => {
    const audio = getChandiAudioInstance();
    spiritualAudioEngine.pause();

    if (audio) {
      fadeOutVolume(1000, () => {
        audio.pause();
      });
    }
  };

  const togglePlay = () => {
    const audio = getChandiAudioInstance();
    if (audio && !audio.paused) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    const audio = getChandiAudioInstance();
    if (audio) {
      const nextMute = !audio.muted;
      audio.muted = nextMute;
      setIsMuted(nextMute);
    }
    spiritualAudioEngine.setVolume(isMuted ? 1 : 0);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 pointer-events-auto">
      {/* Minimal Semi-Transparent Floating Audio Controller */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-black/85 sm:bg-black/60 backdrop-blur-none sm:backdrop-blur-md border border-amber-500/30 shadow-[0_4px_25px_rgba(0,0,0,0.85)] select-none text-amber-100"
      >
        {/* Animated Equalizer Sound Bar */}
        <div className="flex items-center gap-0.9 h-3.5 w-4 ml-1">
          {[0, 1, 2, 3].map((bar) => (
            <motion.span
              key={bar}
              animate={
                isPlaying
                  ? { height: ['20%', '100%', '35%', '85%', '20%'] }
                  : { height: '20%' }
              }
              transition={
                isPlaying
                  ? { duration: 0.8 + bar * 0.18, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.3 }
              }
              className="w-0.8 bg-gradient-to-t from-amber-500 to-amber-200 rounded-full"
            />
          ))}
        </div>

        {/* Minimal Audio Label - desktop/tablet view */}
        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[11px] font-cinzel font-semibold text-amber-200 tracking-wider">
            Chandi Path
          </span>
          <span className="text-[9px] font-cinzel text-amber-400/70 tracking-widest uppercase">
            {isPlaying ? 'Playing Audio' : 'Paused'}
          </span>
        </div>

        {/* Play / Pause Toggle Button - 44px touch target on mobile */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause Chandi Path' : 'Play Chandi Path'}
          className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 rounded-full bg-amber-500/25 hover:bg-amber-500/40 text-amber-300 transition-all duration-300 border border-amber-400/40 cursor-pointer active:scale-95 flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300 ml-0.5" />
          )}
        </button>

        {/* Mute Toggle Button - 44px touch target on mobile */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 rounded-full hover:bg-amber-500/20 text-amber-400/80 transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </motion.div>
    </div>
  );
};
