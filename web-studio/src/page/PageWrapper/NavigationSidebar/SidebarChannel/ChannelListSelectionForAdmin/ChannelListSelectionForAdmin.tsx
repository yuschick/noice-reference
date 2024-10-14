import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { ChannelLogo, Icon, VisuallyHidden } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { ChangeEvent, useId, useState } from 'react';

import { ChannelSelectorOption } from '../ChannelSelectorOption';
import { useChannelSelector } from '../hooks';

import styles from './ChannelListSelectionForAdmin.module.css';

import { useChannelContext } from '@common/channel';
import {
  AdminChannelListSelectorChannelFragment,
  useAdminChannelListSelectorDefaultChannelsQuery,
  useAdminChannelListSelectorSearchLazyQuery,
} from '@gen';

gql`
  query AdminChannelListSelectorDefaultChannels($channelIds: [String!]) {
    liveChannels: channels(liveStatus: LIVE_STATUS_LIVE) {
      channels {
        ...ChannelSelectorOptionChannel
      }
    }

    recentChannels: getChannels(channelIds: $channelIds) {
      channels {
        ...ChannelSelectorOptionChannel
      }
    }
  }
`;

gql`
  query AdminChannelListSelectorSearch($query: String) {
    channelSearch: search(
      query: $query
      entityTypes: [ENTITY_TYPE_CHANNEL]
      cursor: { first: 10 }
    ) {
      resultItems {
        entityId
        entity {
          ... on ChannelChannel {
            ...ChannelSelectorOptionChannel
          }
        }
      }
    }
  }
`;

interface Props {
  selectedChannel: Nullable<AdminChannelListSelectorChannelFragment>;
  isMinimized?: boolean;
  onExpand(): void;
}

export function ChannelListSelectionForAdmin({
  selectedChannel,
  isMinimized,
  onExpand,
}: Props) {
  const [value, setValue] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { recentChannelIds } = useChannelContext();

  const componentId = useId();
  const listId = `list-${componentId}`;
  const listLabelId = `list-label-${componentId}`;

  const { data } = useAdminChannelListSelectorDefaultChannelsQuery({
    variables: {
      channelIds: recentChannelIds,
    },
  });

  const [search, { data: searchData }] = useAdminChannelListSelectorSearchLazyQuery();

  const onBlurCallback = () => {
    setValue('');
    setShowSearchResults(false);
  };

  const searchResultChannels =
    (searchData?.channelSearch?.resultItems.map(
      ({ entity }) => entity,
    ) as AdminChannelListSelectorChannelFragment[]) ?? [];

  const onlineChannels = data?.liveChannels?.channels ?? [];
  const recentChannels = data?.recentChannels?.channels ?? [];
  const defaultChannels = [...onlineChannels, ...recentChannels];

  const {
    activeIndex,
    isExpanded,
    wrapperRef,
    onBlur,
    onFocus,
    onMouseDown,
    onKeyDown,
    onOptionMouseEnter,
    onOptionMouseDown,
    onOptionClick,
  } = useChannelSelector({
    results: showSearchResults ? searchResultChannels : defaultChannels,
    onBlur: onBlurCallback,
    onExpand,
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setValue(query);

    if (query.length < 3) {
      setShowSearchResults(false);
      return;
    }

    setShowSearchResults(true);
    search({ variables: { query } });
  };

  if (!selectedChannel) {
    return null;
  }

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.expanded]: isExpanded,
      })}
      ref={wrapperRef}
    >
      <button
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={isExpanded ? 'true' : 'false'}
        aria-label={selectedChannel.name}
        className={styles.selectButton}
        role="combobox"
        tabIndex={0}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
      >
        <div className={styles.channelDetails}>
          <ChannelLogo
            channel={selectedChannel}
            size="xs"
          />
          {!isMinimized && (
            <span className={styles.channelName}>{selectedChannel.name}</span>
          )}
        </div>

        {!isMinimized && (
          <Icon
            icon={CoreAssets.Icons.ChevronDown}
            size={16}
          />
        )}
      </button>

      {!isMinimized && (
        <div className={styles.listWrapper}>
          <label>
            <VisuallyHidden>Select channel</VisuallyHidden>

            <input
              className={styles.input}
              placeholder="Search channel"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </label>

          {!showSearchResults ? (
            <ul
              aria-label="Channels list"
              className={classNames(styles.list, styles.defaultList)}
              role="listbox"
            >
              <li>
                <span
                  className={styles.listLabel}
                  id={listLabelId}
                >
                  Online
                </span>

                <ul
                  aria-labelledby={listLabelId}
                  className={styles.list}
                >
                  {onlineChannels?.map((channel, index) => (
                    <ChannelSelectorOption
                      channel={channel}
                      isSelected={activeIndex === index}
                      key={channel.id}
                      onClick={onOptionClick}
                      onMouseDown={onOptionMouseDown}
                      onMouseEnter={() => onOptionMouseEnter(index)}
                    />
                  ))}
                  {!onlineChannels?.length && (
                    <li className={styles.noResults}>No live channels</li>
                  )}
                </ul>
              </li>

              {!!recentChannels.length && (
                <li>
                  <span
                    className={styles.listLabel}
                    id={listLabelId}
                  >
                    Recent channels
                  </span>

                  <ul
                    aria-labelledby={listLabelId}
                    className={styles.list}
                  >
                    {recentChannels?.map((channel, index) => (
                      <ChannelSelectorOption
                        channel={channel}
                        isSelected={activeIndex === index + onlineChannels.length}
                        key={channel.id}
                        onClick={onOptionClick}
                        onMouseDown={onOptionMouseDown}
                        onMouseEnter={() =>
                          onOptionMouseEnter(index + onlineChannels.length)
                        }
                      />
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          ) : (
            <ul
              aria-label="Search results"
              className={styles.list}
              role="listbox"
            >
              {searchResultChannels.map((channel, index) => (
                <ChannelSelectorOption
                  channel={channel}
                  isSelected={activeIndex === index}
                  key={channel.id}
                  onClick={onOptionClick}
                  onMouseDown={onOptionMouseDown}
                  onMouseEnter={() => onOptionMouseEnter(index)}
                />
              ))}

              {!searchData?.channelSearch?.resultItems?.length && (
                <li className={styles.noResults}>No results</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

ChannelListSelectionForAdmin.fragments = {
  entry: gql`
    fragment AdminChannelListSelectorChannel on ChannelChannel {
      id
      liveStatus
      name
      ...ChannelLogoChannel
    }
  `,
};
