import { ChannelVisibility } from './ChannelVisibility/ChannelVisibility';
import { RTMPSetup } from './RtmpSetup/RtmpSetup';
import styles from './SettingsStream.module.css';

import { GameConnectLink, NoicePlugin, SettingsOBS } from '@common/button';
import { useChannelContext } from '@common/channel';
import { PageHeading, LayoutBox, SubHeading } from '@common/layout';
import {
  EditStreamKey,
  MatureRatedContentSwitch,
  EditStreamTitle,
  EditCategory,
} from '@common/settings';

export function SettingsStream() {
  const { channelId } = useChannelContext();

  return (
    <>
      <PageHeading title="Stream info" />

      <LayoutBox>
        <EditStreamTitle />

        <EditCategory />

        <MatureRatedContentSwitch />
      </LayoutBox>

      <section className={styles.section}>
        <SubHeading title="Stream setup" />

        <LayoutBox>
          <ChannelVisibility channelId={channelId} />
        </LayoutBox>

        <LayoutBox>
          <EditStreamKey channelId={channelId} />
        </LayoutBox>

        <LayoutBox>
          <RTMPSetup />
        </LayoutBox>

        <LayoutBox>
          <div>
            <h3 className={styles.title}>Get OBS</h3>

            <p className={styles.descriptionText}>
              Currently, Noice supports OBS as a streaming software.
            </p>
          </div>

          <SettingsOBS />
        </LayoutBox>

        <LayoutBox>
          <div>
            <h3 className={styles.title}>Install Noice plugin for OBS</h3>

            <p className={styles.descriptionText}>
              Noice plugin helps you to set up your stream to work correctly with the
              Noice platform.
            </p>
          </div>

          <NoicePlugin />
        </LayoutBox>

        <LayoutBox>
          <div>
            <h3 className={styles.title}>Noice Game Connect</h3>

            <p className={styles.descriptionText}>
              Game Connect detects events from supported games so your viewers can play
              the stream.
              <br />
              <em>* Required for streaming Valorant.</em>
            </p>
          </div>

          <GameConnectLink />
        </LayoutBox>
      </section>
    </>
  );
}
