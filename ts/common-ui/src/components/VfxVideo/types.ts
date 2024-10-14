import { VideoHTMLAttributes } from 'react';

export interface Props extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  isPlaying: boolean;
  delay?: number;
  src: string | string[];
}
