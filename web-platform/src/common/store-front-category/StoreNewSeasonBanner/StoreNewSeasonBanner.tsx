import { gql } from '@apollo/client';
import { ButtonLink, Pill, useBooleanFeatureFlag } from '@noice-com/common-ui';

import styles from './StoreNewSeasonBanner.module.css';

import { getCategoryLink } from '@common/category';
import { Routes } from '@common/route';
import {
  StoreNewSeasonBannerChannelFragment,
  StoreNewSeasonBannerGameFragment,
} from '@gen';

gql`
  fragment StoreNewSeasonBannerGame on GameGame {
    id
    name
    activeSeason {
      id
      name
    }
  }

  fragment StoreNewSeasonBannerChannel on ChannelChannel {
    name
  }
`;

interface Props {
  game: StoreNewSeasonBannerGameFragment;
  channel?: StoreNewSeasonBannerChannelFragment;
}

export function StoreNewSeasonBanner({ game, channel }: Props) {
  const { id: gameId, name: gameName, activeSeason } = game;
  const { name: seasonName } = activeSeason;
  const [useNewBrowseLink] = useBooleanFeatureFlag('categoriesListing');

  return (
    <div className={styles.newSeasonBanner}>
      <div className={styles.newSeasonBannerContent}>
        <Pill
          color="gradient-violet-magenta"
          label="New Season"
        />

        <div className={styles.gameInfoWrapper}>
          <span className={styles.seasonName}>{seasonName}</span>
          <span>for {gameName} creators</span>
        </div>

        <div className={styles.description}>
          <span className={styles.playTheStream}>Play the stream</span> to unlock{' '}
          {!!channel?.name && (
            <>
              <span className={styles.channelName}>{channel.name}’s</span>{' '}
            </>
          )}
          card bundles for the current season.
        </div>
      </div>

      <ButtonLink
        fit="content"
        level="secondary"
        size="sm"
        to={
          useNewBrowseLink
            ? getCategoryLink(gameId)
            : { pathname: Routes.Browse, search: `?category=${gameId}-creators` }
        }
      >
        Browse streams
      </ButtonLink>
    </div>
  );
}
