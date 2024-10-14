import { gql } from '@apollo/client';
import { useBooleanFeatureFlag } from '@noice-com/common-react-core';
import { AuthenticatedUserProvider, useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import takeWhile from 'lodash/takeWhile';

import { HOME_CHANNEL_POLL_INTERVAL } from '../utils';

import { HighlightedChannel } from './HighlightedChannel';
import styles from './HomeHeader.module.css';
import { UserHeaderProfile } from './UserHeaderProfile';

import {
  HighlightedChannelFragment,
  HomeHeaderProfileFragment,
  useHomeHighlightedStreamQuery,
} from '@gen';

gql`
  fragment HomeHeaderProfile on ProfileProfile {
    ...UserHeaderProfile
  }

  query HomeHighlightedStream {
    highlightedChannels(limit: 5) {
      channels {
        id
        ...HighlightedChannel
      }
    }
  }
`;

function pickHighlightedChannel(
  channels: HighlightedChannelFragment[] | undefined,
): Nullable<HighlightedChannelFragment> {
  if (!channels || !channels.length) {
    return null;
  }

  const candidates = takeWhile(channels, (channel) => channel.viewerCount >= 10);
  if (!candidates.length) {
    return channels[0];
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

interface Props {
  profile: Nullable<HomeHeaderProfileFragment>;
  isDailyXpBoostRemaining: boolean;
  noRemainingDailyXpEarnings: boolean;
}

export function HomeHeader({
  profile,
  isDailyXpBoostRemaining,
  noRemainingDailyXpEarnings,
}: Props) {
  const { userId } = useAuthentication();

  const { data } = useHomeHighlightedStreamQuery({
    pollInterval: HOME_CHANNEL_POLL_INTERVAL,
    skip: !userId,
  });
  const highlightedChannel = pickHighlightedChannel(data?.highlightedChannels?.channels);

  const [tighterHomePage] = useBooleanFeatureFlag('categoriesListing');

  return (
    <section
      className={classNames(styles.homeHeader, {
        [styles.tighterHomePage]: tighterHomePage,
      })}
    >
      {profile && (
        <UserHeaderProfile
          isDailyXpBoostRemaining={isDailyXpBoostRemaining}
          noRemainingDailyXpEarnings={noRemainingDailyXpEarnings}
          profile={profile}
        />
      )}

      {highlightedChannel && !!userId && (
        <AuthenticatedUserProvider userId={userId}>
          <div className={styles.highlighted}>
            <HighlightedChannel channel={highlightedChannel} />
          </div>
        </AuthenticatedUserProvider>
      )}
    </section>
  );
}
