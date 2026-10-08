export interface StorySegment {
  id: number;
  startTime: number;
  endTime: number;
  description: string;
  subText?: string;
  position?: 'left' | 'right' | 'center';
}

export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}

export interface StoryTimelineState {
  currentTime: number;
  progress: number;
  activeSegment: StorySegment | null;
  isCompleted: boolean;
}
