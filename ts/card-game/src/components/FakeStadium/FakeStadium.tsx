import { CoreAssets } from '@noice-com/assets-core';

import styles from './FakeStadium.module.css';

import StaticStadium from '@game-assets/images/static-stadium.png';

export function FakeStadium() {
  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundImage: `url(${StaticStadium})`,
      }}
    >
      <video
        autoPlay
        loop
        muted
      >
        <source
          src={CoreAssets.Videos.VideoFull}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
