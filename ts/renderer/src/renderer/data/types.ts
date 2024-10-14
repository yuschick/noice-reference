import { Nullable } from '@noice-com/utils';

export interface RendererFlags {
  useVideoFrame: boolean;
  useDynamicFrameLimiter: boolean;
  showUsernames: boolean;
}

export interface RendererProps {
  canvas: Nullable<OffscreenCanvas | HTMLCanvasElement>;
  isPhotoMode: boolean;
}
