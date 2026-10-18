export interface FramePart {
  id: string;
  name: string;
  folder: string;
  frameCount: number;
  startFrame: number;
  endFrame: number;
  startProgress: number;
  endProgress: number;
}

export interface StoryStageButton {
  label: string;
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'whatsapp';
  external?: boolean;
}

export interface StoryStage {
  id: string;
  name: string;
  startProgress: number;
  endProgress: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
  buttons?: StoryStageButton[];
}

export interface FrameManifest {
  totalFrames: number;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  poster: string;
  parts: FramePart[];
  stages: StoryStage[];
  frames: string[];
}
