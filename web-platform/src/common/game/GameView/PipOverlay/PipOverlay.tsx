import { gql } from '@apollo/client';
import { ConfirmDialog, IconButton, ChannelLogo } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { CgClose } from 'react-icons/cg';
import { FaExpand } from 'react-icons/fa';

import { useClosePiP } from './hooks';
import styles from './PipOverlay.module.css';

import { PipChannelInfoFragment } from '@gen';

gql`
  fragment PipChannelInfo on ChannelChannel {
    ...ChannelLogoChannel
    name
    title
    game {
      id
      name
    }
  }
`;

export interface Props {
  channel: Nullable<PipChannelInfoFragment>;
  isChannelPage?: boolean;
  onExpandClicked(): void;
}

export function PipOverlay({ channel, onExpandClicked, isChannelPage }: Props) {
  const dialog = useClosePiP();

  return (
    <>
      <ConfirmDialog store={dialog} />
      <div
        className={classNames(styles.container, {
          [styles.channelPage]: !!isChannelPage,
        })}
      >
        {!isChannelPage && (
          <div className={styles.controlContainer}>
            <IconButton
              icon={CgClose}
              label="Close Picture in Picture"
              level="secondary"
              size="sm"
              onClick={dialog.actions.open}
            />
          </div>
        )}

        {channel && (
          <>
            {/* We can not return back to stream without channel,
             so do not show the button if channel is missing */}
            <div className={styles.expandButton}>
              <IconButton
                icon={FaExpand}
                label="Expand Picture in Picture"
                level="secondary"
                onClick={onExpandClicked}
              />
            </div>

            <div className={styles.bottom}>
              <div className={styles.streamerLogoWrapper}>
                <ChannelLogo channel={channel} />
              </div>

              <div className={styles.streamInfo}>
                <span className={styles.streamName}>
                  {channel.title.trim() || `${channel.name} playing ${channel.game.name}`}
                </span>
                <p className={styles.gameInfo}>
                  {channel.name} playing {channel.game.name}
                </p>
              </div>
            </div>
          </>
        )}

        <div className={styles.bgOverlay} />
      </div>
    </>
  );
}
