import { IconButton, useFeatureFlag, Tooltip } from '@noice-com/common-ui';
import { StreamSettings as Settings } from '@noice-com/stream';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import {
  MdOutlineVideoLabel,
  MdVrpano,
  MdFullscreenExit,
  MdFullscreen,
} from 'react-icons/md';

import { useSoftwareRendering } from '../hooks/useSoftwareRendering.hook';

import styles from './StreamSettings.module.css';
import { VolumeControl } from './VolumeControl';

interface Props {
  isTheaterMode: boolean;
  isNoicePredictionsEnabled: boolean;
  toggleTheaterMode: () => void;
}

export function StreamSettings({
  isNoicePredictionsEnabled,
  isTheaterMode,
  toggleTheaterMode,
}: Props) {
  const theatreButtonRef = useRef<HTMLButtonElement>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null);

  const [streamSettingsEnabledFlag] = useFeatureFlag('streamSettings', 'disabled');
  const { isSoftwareRendering, loading: isSoftwareRenderingLoading } =
    useSoftwareRendering();

  const [isFullscreen, setFullscreen] = useState(false);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  return (
    <div
      className={classNames(styles.controlOverlay, {
        [styles.theaterMode]: isTheaterMode,
      })}
      data-ftue-anchor="streamWindow"
    >
      <div className={styles.controlRow}>
        <div className={styles.controlContainer}>
          <VolumeControl />
        </div>

        {isNoicePredictionsEnabled &&
          !isSoftwareRendering &&
          !isSoftwareRenderingLoading && (
            <div className={styles.controlContainer}>
              <Tooltip
                content={isTheaterMode ? 'Arena View' : 'Theater Mode'}
                placement="top"
                triggerRef={theatreButtonRef}
              >
                <IconButton
                  data-ftue-anchor={!isTheaterMode ? 'theater-mode-button' : undefined}
                  icon={isTheaterMode ? MdVrpano : MdOutlineVideoLabel}
                  label={`${isTheaterMode ? 'Close' : 'Open'} theater mode`}
                  ref={theatreButtonRef}
                  variant="ghost"
                  onClick={toggleTheaterMode}
                />
              </Tooltip>
            </div>
          )}

        <div className={styles.controlContainer}>
          {streamSettingsEnabledFlag === 'enabled' && <Settings />}
        </div>
        <div className={styles.controlContainer}>
          <Tooltip
            content={isFullscreen ? 'Exit full screen' : 'Full screen'}
            placement="top"
            triggerRef={fullscreenButtonRef}
          >
            <IconButton
              icon={isFullscreen ? MdFullscreenExit : MdFullscreen}
              label={isFullscreen ? 'Exit full screen' : 'Full screen'}
              ref={fullscreenButtonRef}
              variant="ghost"
              onClick={toggleFullScreen}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
