import { gql } from '@apollo/client';
import { Image, CommonUtils } from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';
import classNames from 'classnames';
import { useId } from 'react';

import styles from './OverviewStage.module.css';

import { SubscriptionModalOverviewStageChannelFragment, BadgeBadgeType } from '@gen';

interface Props {
  channel: SubscriptionModalOverviewStageChannelFragment;
}

export function OverviewStage({ channel }: Props) {
  const id = useId();

  const { name } = channel;

  const emojis = CommonUtils.getChannelEmojis(channel);

  return (
    <>
      <section>
        <p>By subscribing you’ll support {name} and also unlock special channel perks.</p>
      </section>

      <section className={styles.perkSection}>
        <p className={styles.perkDescription}>
          As a thank you from {name} you will get access to:
        </p>

        <div className={styles.perkWrapper}>
          {!!emojis.length && (
            <>
              <div>
                <span
                  className={styles.perkListTitle}
                  id={`emoji-title-${id}`}
                >
                  {emojis.length} Custom channel emoji{emojis.length === 1 ? '' : 's'}
                </span>

                <ul
                  aria-labelledby={`emoji-title-${id}`}
                  className={styles.perkList}
                >
                  {emojis.map(({ id, name, image }) => (
                    <li key={id}>
                      <Image
                        alt={name}
                        height={28}
                        src={image}
                        width={28}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.perkDivider} />
            </>
          )}

          <div>
            <span
              className={styles.perkListTitle}
              id={`badge-title-${id}`}
            >
              Subscriber badges
            </span>

            <span className={styles.perkListDescription}>
              You will earn a new subscriber badge every month that you stay subscribed to
              show your support for the streamer in the chat and in your profile.
            </span>

            <ul
              aria-labelledby={`badge-title-${id}`}
              className={classNames(styles.perkList, styles.badgeList)}
            >
              {Array(12)
                .fill(null)
                .map((_, i) => (
                  <li key={`badge-${i}`}>
                    <UserBadge
                      badge={{ type: BadgeBadgeType.TypeChannelSubscriber, level: i + 1 }}
                      badgeSize={24}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.priceDisclaimerSection}>
        <p>
          The price is an estimate and may be adjusted based on your region.
          <br />
          Final price will be disclosed at checkout.
        </p>
      </section>
    </>
  );
}

OverviewStage.fragments = {
  entry: gql`
    fragment SubscriptionModalOverviewStageChannel on ChannelChannel {
      name
      ...SubscriptionGetChannelEmojisChannel
    }
  `,
};
