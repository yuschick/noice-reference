import { gql } from '@apollo/client';
import { useDialog, Dialog, ChannelLogo, useAnalytics } from '@noice-com/common-ui';
import { useEffect, useRef } from 'react';

import styles from './GameCardStreamerDialog.module.css';

import { GameCardStreamerDialogStreamerCardFragment } from '@game-gen';

interface Props {
  streamerCard: GameCardStreamerDialogStreamerCardFragment;
  onClose: () => void;
}

export function GameCardStreamerDialog({ streamerCard, onClose }: Props) {
  const { video, channel } = streamerCard;
  const { trackEvent } = useAnalytics();
  const videoRef = useRef<HTMLVideoElement>(null);

  const dialog = useDialog({
    title: 'Highlight Clip',
    initialState: 'open',
    onClose,
  });

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) {
      return;
    }

    const onPlay = () => {
      trackEvent({
        clientStreamerCardVideoModalPlayStarted: {
          channelId: streamerCard.channel.id,
          cardId: streamerCard.id,
        },
      });
    };

    const onEnd = () => {
      trackEvent({
        clientStreamerCardVideoModalPlayEnded: {
          channelId: streamerCard.channel.id,
          cardId: streamerCard.id,
        },
      });
      // Loop video. Cant use loop attribute because it doesnt fire ended event
      currentVideo.play();
    };

    currentVideo.addEventListener('play', onPlay);
    currentVideo.addEventListener('ended', onEnd);

    return () => {
      currentVideo.removeEventListener('play', onPlay);
      currentVideo.removeEventListener('ended', onEnd);
    };
  }, [streamerCard, trackEvent]);

  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Close />
      <Dialog.Content>
        <div className={styles.gameCardStreamerDialogTitleRow}>
          <div className={styles.gameCardStreamerDialogLogoWrapper}>
            <ChannelLogo channel={channel} />
          </div>
          <div>
            <div className={styles.gameCardStreamerDialogLabel}>{channel.name}</div>
            <div className={styles.gameCardStreamerDialogSecondaryLabel}>
              Creator card
            </div>
          </div>
        </div>

        <video
          className={styles.gameCardStreamerDialogVideo}
          ref={videoRef}
          src={video}
          autoPlay
          controls
        />
      </Dialog.Content>
    </Dialog>
  );
}

GameCardStreamerDialog.fragments = {
  streamerCard: gql`
    fragment GameCardStreamerDialogStreamerCard on GameLogicStreamerCard {
      id
      video
      channel {
        id
        name
        ...ChannelLogoChannel
      }
    }
  `,
};
