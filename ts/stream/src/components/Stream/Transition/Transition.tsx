import { CSSProperties } from 'react';

import styles from './Transition.module.css';

interface Props {
  duration: number;
}

export function Transition({ duration }: Props) {
  return (
    <div
      className={styles.cameraDriveTransition}
      style={
        {
          '--camera-drive-transition-duration': `${duration}ms`,
        } as CSSProperties
      }
    >
      <div className={styles.stingerWrapper}>
        <video
          className={styles.stingerVideo}
          autoPlay
          muted
        >
          <source
            src="https://storage.googleapis.com/noice-client-assets-b9745b84/stingers/Noice_stinger_HD.webm"
            type="video/webm"
          ></source>
        </video>
      </div>
    </div>
  );
}
