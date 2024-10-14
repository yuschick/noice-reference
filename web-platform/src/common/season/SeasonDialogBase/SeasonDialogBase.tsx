import { gql } from '@apollo/client';
import {
  Button,
  UseDialogResult,
  WithChildren,
  Dialog,
  Image,
} from '@noice-com/common-ui';
import { ReactNode } from 'react';

import { isReactNativeWebView } from '../../../embeds/bridge';

import styles from './SeasonDialogBase.module.css';

import { SeasonDialogBaseSeasonFragment } from '@gen';

type Props = WithChildren & {
  buttonText: string;
  dialogStore: UseDialogResult;
  season: SeasonDialogBaseSeasonFragment;
  showBackgroundVFXVideo?: boolean;
  slots?: {
    backgroundVfxVideo: ReactNode;
  };
};

export function SeasonDialogBase({
  children,
  season,
  buttonText,
  dialogStore,
  slots,
}: Props) {
  const isEmbed = isReactNativeWebView();

  if (isEmbed) {
    return null;
  }

  return (
    <Dialog store={dialogStore}>
      <Dialog.Header />

      <Dialog.Content>
        <div className={styles.contentWrapper}>
          {slots?.backgroundVfxVideo ? slots.backgroundVfxVideo : null}
          <div className={styles.seasonInfo}>
            <Image
              alt="Season badge"
              className={styles.seasonBadgeWrapper}
              fit="contain"
              height={40}
              sizes="2.5rem"
              src={season.badgeUrl}
              width={40}
            />
            <div className={styles.seasonLabelsWrapper}>
              <span className={styles.seasonName}>{season.name}</span>
              <span className={styles.gameName}>for {season.game.name} Creators</span>
            </div>
          </div>
          <div className={styles.seasonDialogDivider} />
          {children}
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <div className={styles.actionWrapper}>
          <Button
            fit="container"
            size="lg"
            theme="dark"
            onClick={dialogStore.actions.close}
          >
            {buttonText}
          </Button>
        </div>
      </Dialog.Actions>
    </Dialog>
  );
}

SeasonDialogBase.fragment = {
  season: gql`
    fragment SeasonDialogBaseSeason on GameSeason {
      id
      name
      badgeUrl
      cardBackgroundUrls {
        rarity
        url
      }
      game {
        id
        name
      }
    }
  `,
};
