import { Button, Callout, useAnalytics } from '@noice-com/common-ui';

import { OnboardingStepProps } from '../../types';

import styles from './StreamingOnNoiceSection.module.css';

import { NoicePlugin, SettingsOBS } from '@common/button';
import { LayoutBox } from '@common/layout';

export const StreamingOnNoiceSection = ({
  onCompleted,
  section: sectionProp,
}: OnboardingStepProps) => {
  const section = `${sectionProp}-streaming-on-noice`;
  const { trackAnchorClick, trackButtonClickEventOnMouseClick } = useAnalytics();

  return (
    <>
      <ol className={styles.steps}>
        <li>
          <div className={styles.step}>
            <div className={styles.stepDescription}>
              <h3 className={styles.title}>Install OBS</h3>
              <div className={styles.description}>
                Noice currently supports only OBS as a streaming software. If you’re not
                yet using OBS, install it from below.
              </div>
            </div>
            <SettingsOBS
              onClick={(e) => {
                trackAnchorClick(e, section);
              }}
            />
          </div>
        </li>
        <li>
          <div className={styles.step}>
            <div className={styles.stepDescription}>
              <h3 className={styles.title}>Install the Noice plugin for OBS</h3>
              <div className={styles.description}>
                Our plugin helps you to set up your stream to work correctly with the
                Noice platform.
              </div>
            </div>
            <NoicePlugin
              hideVersion
              onClick={(e) => {
                trackAnchorClick(e, section);
              }}
            />
            <Callout
              message="You need to restart OBS after installing the plugin."
              theme="gray"
              type="warning"
              variant="bordered"
            />
          </div>
        </li>
        <li>
          <div className={styles.step}>
            <div className={styles.stepDescription}>
              <h3 className={styles.title}>Adjust your OBS settings for Noice</h3>
              <div className={styles.description}>
                To avoid stream stutter, please adjust the following OBS settings.
              </div>
            </div>
            <LayoutBox>
              <div className={styles.hint}>
                <h4 className={styles.title}>Set B-frames to Zero</h4>
                <p>
                  Go to OBS{' '}
                  <span className={styles.muted}>
                    Settings &gt; Output &gt; Streaming
                  </span>
                  , scroll to the bottom and change the setting based on the encoder in
                  use:
                </p>
                <ul>
                  <li>Nvidia NVENC or AMD encoders: Set &quot;Max B-frames&quot; to 0</li>
                  <li>
                    x264 encoder: Under Advanced Output Mode, add bframes=0 in the
                    &quot;x264 Options&quot;
                  </li>
                </ul>
              </div>
            </LayoutBox>
            <LayoutBox>
              <div className={styles.hint}>
                <h4 className={styles.title}>Set Stream Bitrate to 6000Kbps+</h4>
                <p>
                  Go to OBS{' '}
                  <span className={styles.muted}>
                    Settings &gt; Output &gt; Encoder Settings
                  </span>{' '}
                  and set the stream bitrate between 6000 and 9000Kbps for optimal
                  results.
                </p>
              </div>
            </LayoutBox>
          </div>
        </li>
      </ol>
      <div>
        <Button
          fit="content"
          size="sm"
          variant="cta"
          onClick={(e) => {
            trackButtonClickEventOnMouseClick(e, section);
            onCompleted();
          }}
        >
          Got it
        </Button>
      </div>
    </>
  );
};
