import { CSSProperties } from 'react';

import styles from './AnimatedPngPlayer.module.css';
import { useApngPlayerVisible } from './hooks';

interface Props {
  delay?: number;
  duration: number;
  src: string;
  animationCount?: number;
  infinite?: boolean;
  onCompleted?: () => void;
}

export function AnimatedPngPlayer({
  delay,
  src,
  duration,
  animationCount,
  infinite,
  onCompleted,
}: Props) {
  const visible = useApngPlayerVisible({
    delay,
    duration,
    animationCount,
    infinite,
    onCompleted,
  });

  if (!visible) {
    return null;
  }

  return (
    <div
      className={styles.apngPlayerRoot}
      style={
        {
          '--_css-apng-src': `url(${src})`,
        } as CSSProperties
      }
    ></div>
  );
}
