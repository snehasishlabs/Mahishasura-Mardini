import ffmpegPath from 'ffmpeg-static';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

const videos = [
  { input: 'video1.mp4', output: 'video1_opt.mp4' },
  { input: 'video2.mp4', output: 'video2_opt.mp4' },
  { input: 'video3.mp4', output: 'video3_opt.mp4' }
];

videos.forEach(({ input, output }) => {
  const inputPath = path.join(publicDir, input);
  const outputPath = path.join(publicDir, output);

  console.log(`Optimizing ${input} -> ${output}...`);
  const initialSize = fs.statSync(inputPath).size;

  // FFmpeg command:
  // -c:v libx264 (H.264 video codec)
  // -pix_fmt yuv420p (broad compatibility)
  // -crf 24 (high quality with efficient compression)
  // -preset slow (better compression efficiency)
  // -movflags +faststart (MOOV atom at front for fast initial frame decoding & HTTP range seeking)
  // -an (remove audio track, audio is in chandi-path.mp3)
  const cmd = `"${ffmpegPath}" -y -i "${inputPath}" -c:v libx264 -pix_fmt yuv420p -crf 24 -preset fast -movflags +faststart -an "${outputPath}"`;
  
  execSync(cmd, { stdio: 'inherit' });

  const finalSize = fs.statSync(outputPath).size;
  const reduction = ((1 - finalSize / initialSize) * 100).toFixed(2);
  console.log(`Done! Original: ${(initialSize / 1024 / 1024).toFixed(2)} MB -> Optimized: ${(finalSize / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)\n`);
});
