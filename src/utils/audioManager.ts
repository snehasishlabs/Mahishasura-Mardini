// Singleton Chandi Path Audio Manager for Instant Synchronous Playback on User Gesture
import { spiritualAudioEngine } from './audioSynth';

let chandiAudioInstance: HTMLAudioElement | null = null;

/**
 * Requirement 1 & 2: Create audio element during page initialization & preload audio
 */
export const getChandiAudioInstance = (): HTMLAudioElement => {
  if (!chandiAudioInstance && typeof window !== 'undefined') {
    chandiAudioInstance = new Audio('/chandi-path.mp3');
    chandiAudioInstance.id = 'chandi-path-audio';
    chandiAudioInstance.loop = true;
    chandiAudioInstance.preload = 'auto';
  }
  return chandiAudioInstance!;
};

// Initialize immediately on module load
if (typeof window !== 'undefined') {
  getChandiAudioInstance();
}

/**
 * Requirements 3, 4, 5, 7:
 * Direct synchronous playback invoked directly inside user click handler
 */
export const playChandiPathDirectly = (): HTMLAudioElement => {
  const audio = getChandiAudioInstance();

  const playAudioNow = () => {
    try {
      audio.currentTime = 0;
    } catch (err) {
      console.error("Setting currentTime failed", err);
    }

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio started");
        })
        .catch((err) => {
          console.error("Playback failed", err);
        });
    }
  };

  // Requirement 7: Check if metadata loaded
  if (audio.readyState >= 1) { // HAVE_METADATA
    playAudioNow();
  } else {
    audio.addEventListener('loadedmetadata', () => {
      playAudioNow();
    }, { once: true });
    playAudioNow();
  }

  // Also start Web Audio synth engine
  try {
    spiritualAudioEngine.start();
  } catch {
    // ignore synth init errors
  }

  return audio;
};
