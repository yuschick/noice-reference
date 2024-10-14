import { usePlayVfxVideo } from './hooks';
import type { Props } from './types';

const getType = (src: string) => {
  const extension = src.split('.').pop();
  if (extension === 'webm') {
    return 'video/webm';
  }

  if (extension === 'mp4') {
    return 'video/mp4;codecs=hvc1';
  }

  throw new Error(`Unsupported video type: ${extension}`);
};

//This makes source that mp4 encoding intended for OS systems always gets the first place, which is imperative for video component to work on all platforms
const sortSources = (sources: string[]) => {
  return sources.sort((a, b) => {
    const extA = a.split('.').pop();
    const extB = b.split('.').pop();

    if (extA === 'mp4' && extB !== 'mp4') {
      return -1;
    }

    if (extA !== 'mp4' && extB === 'mp4') {
      return 1;
    }
    return 0;
  });
};

export function VfxVideo({
  className,
  src,
  isPlaying,
  delay,
  ...restOfAttributes
}: Props) {
  const sources = src instanceof Array ? src : [src];
  const sortedSources = sortSources(sources);

  const { playVideo, onEnded } = usePlayVfxVideo({
    isPlaying,
    delay,
    onEnded: restOfAttributes.onEnded,
  });

  if (!playVideo) {
    return null;
  }

  return (
    <video
      className={className}
      {...restOfAttributes}
      autoPlay
      muted
      playsInline
      onEnded={onEnded}
    >
      {sortedSources.map((src) => (
        <source
          key={src}
          src={src}
          type={getType(src)}
        />
      ))}
    </video>
  );
}
