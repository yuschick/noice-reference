import { useAuthenticatedUser } from '@noice-com/common-ui';
import {
  ContentMode,
  ContentModeUserSpotlightMode,
} from '@noice-com/schemas/rendering/transitions.pb';

import { BestGroup } from './BestGroup';
import { BestPlay } from './BestPlay';
import { BestPlayer } from './BestPlayer';
import { Emotes } from './Emotes';
import styles from './Spotlight.module.css';

export interface Props {
  contentMode: ContentMode;
  hideEmotes?: boolean;
}

export function Spotlight({ contentMode, hideEmotes }: Props) {
  const { userId } = useAuthenticatedUser();

  const showEmotes =
    !hideEmotes &&
    ((contentMode.groupSpotlight &&
      contentMode.groupSpotlight.players?.find((player) => player.userId === userId)) ||
      (contentMode.userSpotlight &&
        (contentMode.userSpotlight.player?.id === userId ||
          contentMode.userSpotlight.userId === userId)));

  return (
    <>
      <div className={styles.spotlightWrapper}>
        {!!contentMode.groupSpotlight && (
          <BestGroup groupSpotlight={contentMode.groupSpotlight} />
        )}
        {!!contentMode.userSpotlight && (
          <>
            {contentMode.userSpotlight.mode ===
              ContentModeUserSpotlightMode.MODE_BEST_PLAYER && (
              <BestPlayer userSpotlight={contentMode.userSpotlight} />
            )}
            {contentMode.userSpotlight.mode ===
              ContentModeUserSpotlightMode.MODE_BEST_CARD && (
              <BestPlay userSpotlight={contentMode.userSpotlight} />
            )}
          </>
        )}
      </div>
      {showEmotes && <Emotes />}
    </>
  );
}
