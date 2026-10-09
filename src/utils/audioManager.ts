// Singleton Chandi Path Audio Manager for Instant Synchronous Playback on User Gesture
import { spiritualAudioEngine } from './audioSynth';

let chandiAudioInstance: HTMLAudioElement | null = null;

const AUDIO_SRC = '/audio/new-chandi-path.mp3';

/**
 * Requirement 1 & 2: Create audio element during page initialization & preload audio
 */
export const getChandiAudioInstance = (): HTMLAudioElement => {
  if (!chandiAudioInstance && typeof window !== 'undefined') {
    chandiAudioInstance = new Audio(AUDIO_SRC);
    chandiAudioInstance.id = 'chandi-path-audio';
    chandiAudioInstance.loop = true;
    chandiAudioInstance.preload = 'auto';

    // Requirement 8: Handle audio loading and playback errors gracefully
    chandiAudioInstance.addEventListener('error', (e) => {
      console.error(
        `[Audio Error] Failed to load Chandi Path audio from "${AUDIO_SRC}". ` +
        `Please check if the file exists in public/audio/ and is a supported MP4/MP3 format.`,
        e
      );
    });
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
      console.error("Setting audio currentTime failed", err);
    }

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Chandi Path audio started successfully");
        })
        .catch((err) => {
          console.error("Chandi Path audio playback failed:", err);
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

  // Also start Web Audio synth engine fallback
  try {
    spiritualAudioEngine.start();
  } catch {
    // ignore synth init errors
  }

  return audio;
};
