# মহিষাসুরমর্দিনী | Mahishasura Mardini — Interactive Cinematic Scroll Experience

An interactive cinematic scroll-controlled web application honoring the journey of Maa Durga during Durga Puja in Bengal. Built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS v4**, **GSAP ScrollTrigger**, and **Framer Motion**.

---

## 🪔 Project Overview

**Mahishasura Mardini** translates Bengal's iconic Durga Puja tradition into a continuous 96-second scroll-driven visual and auditory masterpiece. The experience combines multi-clip video scrubbing, Bengali typography, spiritual ambient audio, and an emotional farewell tribute.

---

## ✨ Key Features

1. **Lotus Bloom Loading Experience**:
   - Fullscreen autumn Bengal landscape with blooming golden lotus crossfade transition.
   - Synchronous user gesture audio initialization.

2. **Continuous 96-Second Video Engine**:
   - Seamless multi-video timeline (`video1.mp4` 32s, `video2.mp4` 31s, `video3.mp4` 33s) scrubbed smoothly across a pinned 1200vh container.
   - Zero-delay hardware-accelerated clip transitions with zero black frames, flicker, or layout shifts.

3. **Grouped Bengali Narrative Timeline**:
   - 16 exact narrative moments (Autumn Dawn, Kash Flowers, Divine Boon, Rise of Durga, Trishul Strike, Bisorjon) rendered as floating lower-third text cards.
   - State re-renders throttled to segment boundary transitions for 60fps scrolling performance.

4. **Chandi Path Audio Controller**:
   - Preloaded soundtrack with instant playback upon clicking *Begin the Journey*.
   - Minimal bottom-right floating pill with animated equalizer, play/pause, and mute/unmute controls.

5. **Tribute & Farewell Section**:
   - Post-experience tribute section naturally revealing Bengali closing text (*"আসছে বছর আবার হবে।"*) and soft golden radial glow.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS v4 (Vanilla CSS variables + utility utilities)
- **Animation & Scroll Control**: GSAP (ScrollTrigger) + Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite + TypeScript (`tsc -b && vite build`)

---

## 📁 Repository Structure

```
Mahisasur mardini/
├── public/
│   ├── video1.mp4                # Story segment 1 (0s–32s, 43MB)
│   ├── video2.mp4                # Story segment 2 (32s–63s, 43MB)
│   ├── video3.mp4                # Story segment 3 (63s–96s, 38.5MB)
│   ├── chandi-path.mp3           # Chandi Path audio track (25.4MB)
│   ├── loading-background.webp   # Autumn landscape background
│   ├── closed-lotus.png          # Golden lotus closed state
│   ├── open-lotus.png            # Golden lotus bloomed state
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── LoadingScreen.tsx     # Lotus blooming start screen
│   │   ├── StoryCanvasVideo.tsx  # GSAP ScrollTrigger 3-video scrub engine
│   │   ├── DescriptionOverlay.tsx# Floating lower-third narrative card
│   │   ├── AudioController.tsx   # Persistent audio pill & equalizer
│   │   ├── AboutSection.tsx      # Post-story tribute section
│   │   └── GoldenParticles.tsx   # Canvas ambient particle effect
│   ├── data/
│   │   └── storyTimeline.ts      # 16 narrative timeline segments
│   ├── utils/
│   │   ├── audioManager.ts       # Singleton preloaded audio manager
│   │   └── audioSynth.ts         # Web Audio synth fallback engine
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx                   # Main orchestrator component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global CSS & typography tokens
├── vercel.json                   # Vercel caching & routing configuration
├── vite.config.ts
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Mahishasura-Mardini.git

# Navigate into project directory
cd Mahishasura-Mardini

# Install dependencies
npm install
```

### Local Development

```bash
# Run development server on http://localhost:5173
npm run dev
```

### Production Build

```bash
# Typecheck & build production bundle into /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deploying to Vercel

This project is fully configured for zero-config Vercel deployment:

1. Push your code to GitHub.
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. **Framework Preset**: Select **Vite**.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Click **Deploy**.

> **Note on Media Assets**: All media assets (`video1.mp4`, `video2.mp4`, `video3.mp4`, `chandi-path.mp3`) are placed in `/public` (under 45MB each) and configured in `vercel.json` with immutable 1-year browser cache headers (`max-age=31536000`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
