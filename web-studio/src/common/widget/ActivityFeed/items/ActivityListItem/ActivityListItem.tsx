import classNames from 'classnames';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../../ActivityFeedSettingsProvider';
import { AvatarItemPurchase } from '../AvatarItemPurchase';
import { ChannelSubscriptionRenewal } from '../ChannelSubscriptionRenewal';
import { GameMatchUpdate } from '../GameMatchUpdate';
import { HighScoringCard } from '../HighScoringCard';
import { MatchResultsBestPlay } from '../MatchResults/MatchResultsBestPlay';
import { MatchResultsBestPlayer } from '../MatchResults/MatchResultsBestPlayer';
import { MatchResultsBestTeam } from '../MatchResults/MatchResultsBestTeam';
import { MatchResultsChallenges } from '../MatchResults/MatchResultsChallenges';
import { NewChannelFollower } from '../NewChannelFollower';
import { NewChannelSubscriber } from '../NewChannelSubscriber';
import { NewChannelSubscriptionGifted } from '../NewChannelSubscriptionGifted';
import { NewChannelViewer } from '../NewChannelViewer';
import { PremiumBundlePurchase } from '../PremiumBundlePurchase';
import { StreamerCardPurchase } from '../StreamerCardPurchase';
import { StreamInfoUpdate } from '../StreamInfoUpdate';
import { StreamStateUpdate } from '../StreamStateUpdate';

import styles from './ActivityListItem.module.css';

import { StreamActivityFeedSubscription, StreamActivityFeedHistoryQuery } from '@gen';

interface Props {
  data?:
    | StreamActivityFeedSubscription['channelActivityEventsSubscribe']
    | NonNullable<StreamActivityFeedHistoryQuery['channelActivityEvents']>['events'][0];
}

export function ActivityListItem({ data }: Props) {
  const context = useContext(ActivityFeedSettingsContext);
  const activity = data;
  const { content } = data || {};

  if (!content || !activity) {
    return null;
  }

  return (
    <>
      <li
        className={classNames(
          styles.activityFeedItem,
          styles[context?.fontSize || 'small'],
          {
            [styles.streamStarted]: content.__typename === 'StreamerStreamStarted',
            [styles.streamEnded]: content.__typename === 'StreamerStreamEnded',
          },
        )}
      >
        {content.__typename === 'GameLogicHighScoringCardPromotedMsg' && (
          <HighScoringCard data={activity} />
        )}

        {content.__typename === 'StreamerAvatarItemPurchased' && (
          <AvatarItemPurchase data={activity} />
        )}

        {(content.__typename === 'StreamerMatchStarted' ||
          content.__typename === 'StreamerMatchEnded') && (
          <GameMatchUpdate data={activity} />
        )}

        {content.__typename === 'StreamerPlayerJoined' && (
          <NewChannelViewer data={activity} />
        )}

        {content.__typename === 'StreamerChannelSubscribed' && (
          <NewChannelSubscriber data={activity} />
        )}

        {content.__typename === 'StreamerSubscriptionGifted' && (
          <NewChannelSubscriptionGifted data={activity} />
        )}

        {content.__typename === 'StreamerSubscriptionRenewed' && (
          <ChannelSubscriptionRenewal data={activity} />
        )}

        {content.__typename === 'StreamerChannelFollowed' && (
          <NewChannelFollower data={activity} />
        )}

        {content.__typename === 'StreamerStreamerCardPurchased' && (
          <StreamerCardPurchase data={activity} />
        )}

        {content.__typename === 'StreamerBundlePurchased' && (
          <PremiumBundlePurchase data={activity} />
        )}

        {(content.__typename === 'StreamerStreamStarted' ||
          content.__typename === 'StreamerStreamEnded') && (
          <StreamStateUpdate data={activity} />
        )}

        {content.__typename === 'StreamerStreamTitleChanged' && (
          <StreamInfoUpdate data={activity} />
        )}
      </li>

      {/* Match Results */}
      {content.__typename === 'StreamerMatchEnded' && (
        <>
          {content.challengeStatuses && (
            <li
              className={classNames(
                styles.activityFeedItem,
                styles[context?.fontSize || 'small'],
              )}
            >
              <MatchResultsChallenges data={activity} />
            </li>
          )}

          {content.bestGroup && (
            <li
              className={classNames(
                styles.activityFeedItem,
                styles.bestTeam,
                styles[context?.fontSize || 'small'],
              )}
            >
              <MatchResultsBestTeam data={activity} />
            </li>
          )}

          {content.bestPlayer && (
            <li
              className={classNames(
                styles.activityFeedItem,
                styles[context?.fontSize || 'small'],
              )}
            >
              <MatchResultsBestPlayer data={activity} />
            </li>
          )}

          {content.bestCard && (
            <li
              className={classNames(
                styles.activityFeedItem,
                styles[context?.fontSize || 'small'],
              )}
            >
              <MatchResultsBestPlay data={activity} />
            </li>
          )}
        </>
      )}
    </>
  );
}
