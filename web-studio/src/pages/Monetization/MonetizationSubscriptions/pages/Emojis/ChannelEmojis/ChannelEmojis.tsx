import { gql } from '@apollo/client';
import {
  Button,
  ButtonLink,
  Callout,
  Image,
  LoadingSkeleton,
  Pill,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useId } from 'react';
import { generatePath, Link } from 'react-router-dom';

import { useSubscriptionsLinks } from '../../../hooks/useSubscriptionsLinks.hook';
import { MonetizationSubscriptionsHeader } from '../../../MonetizationSubscriptionsHeader/MonetizationSubscriptionsHeader';
import { useChannelEmoji } from '../context/ChannelEmojiProvider';

import styles from './ChannelEmojis.module.css';

import { useChannelContext } from '@common/channel';
import { LayoutBox } from '@common/layout';
import { SubscriptionsSubRoutes } from '@common/route';
import { useChannelEmojisQuery } from '@gen';

gql`
  query ChannelEmojis($channelId: ID!, $cursor: String) {
    channelEmojis(
      channelId: $channelId
      cursor: { first: 16, after: $cursor }
      includeDisabled: true
      includeCount: true
    ) {
      emojis {
        id
        image
        label
        disabled
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
      }
      count {
        total
        disabled
      }
    }
  }
`;

export function ChannelEmojis() {
  const id = useId();
  const { channelId } = useChannelContext();
  const { isMaxEmojiAmountReached, isLoadingMaxEmojiAmount } = useChannelEmoji();

  const emojiLabelId = `emoji-label-${id}`;
  const emojiCodeId = `emoji-code-${id}`;

  const { data, loading, fetchMore } = useChannelEmojisQuery({
    variables: {
      channelId,
    },
  });

  const hasPager =
    data?.channelEmojis?.pageInfo.hasNextPage ||
    data?.channelEmojis?.pageInfo.hasPreviousPage;
  const totalCount = data?.channelEmojis?.count?.total ?? 0;
  const disabledCount = data?.channelEmojis?.count?.disabled ?? 0;
  const currentPageCount = data?.channelEmojis?.emojis.length ?? 0;
  const { toSubscriptionsSettings, toEmojis } = useSubscriptionsLinks();

  return (
    <>
      <MonetizationSubscriptionsHeader
        description="Channel emojis are available on all Noice channels for you and your subscribers."
        title="EMOJIS"
        to={toSubscriptionsSettings}
      >
        {!isMaxEmojiAmountReached ? (
          <ButtonLink
            fit="content"
            size="sm"
            to={`${toEmojis}/${SubscriptionsSubRoutes.EmojiAdd}`}
          >
            New Emoji
          </ButtonLink>
        ) : (
          <Button
            fit="content"
            size="sm"
            isDisabled
          >
            New Emoji
          </Button>
        )}
      </MonetizationSubscriptionsHeader>
      {!isLoadingMaxEmojiAmount && isMaxEmojiAmountReached && (
        <Callout
          message="Max amount of emojis is reached, adding new emojis is disabled."
          theme="gray"
          type="error"
          variant="bordered"
        />
      )}

      <LayoutBox>
        {loading ? (
          <LoadingSkeleton
            count={8}
            height={32}
          />
        ) : !data?.channelEmojis?.emojis.length ? (
          <div>You don’t have any emojis yet.</div>
        ) : (
          <>
            <div className={styles.pageInfo}>
              <span>
                {hasPager ? (
                  <>
                    {currentPageCount}/{totalCount} emojis
                  </>
                ) : (
                  <>
                    {totalCount} emoji{totalCount === 1 ? '' : 's'}{' '}
                  </>
                )}
                {!!disabledCount && <> ({disabledCount} disabled)</>}
              </span>
            </div>
            <div className={styles.emojiListWrapper}>
              <div className={classNames(styles.emojiListRow, styles.listHeadings)}>
                <span id={emojiLabelId}>Emoji</span>
                <span id={emojiCodeId}>Code</span>
              </div>

              {data?.channelEmojis?.emojis.map(({ id, image, label, disabled }) => (
                <Link
                  className={classNames(styles.emojiListRow, styles.emojiLink, {
                    [styles.disabledByNoice]: disabled,
                  })}
                  key={id}
                  to={generatePath(`${toEmojis}/${SubscriptionsSubRoutes.EmojiEdit}`, {
                    emojiId: id,
                  })}
                >
                  <Image
                    alt={label}
                    aria-labelledby={emojiLabelId}
                    className={styles.emojiImage}
                    height={32}
                    src={image}
                    width={32}
                  />

                  <span aria-labelledby={emojiCodeId}>:{label}:</span>

                  {disabled && (
                    <Pill
                      color="gray-950"
                      label="Disabled"
                    />
                  )}
                </Link>
              ))}
            </div>

            {data.channelEmojis.pageInfo.hasNextPage && (
              <div className={styles.pageInfo}>
                <Button
                  fit="content"
                  level="secondary"
                  size="xs"
                  onClick={() =>
                    fetchMore({
                      variables: { cursor: data?.channelEmojis?.pageInfo.endCursor },
                    })
                  }
                >
                  Show more
                </Button>
              </div>
            )}
          </>
        )}
      </LayoutBox>
    </>
  );
}
