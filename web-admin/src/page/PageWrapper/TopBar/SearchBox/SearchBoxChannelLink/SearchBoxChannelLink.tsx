import { gql } from '@apollo/client';
import { ChannelLogo } from '@noice-com/common-ui';
import { generatePath } from 'react-router';

import styles from './SearchBoxChannelLink.module.css';

import { PermissionLink } from '@common/permission';
import { getChannelMatchedField } from '@common/search';
import { HighlightedText } from '@common/text';
import { SearchBoxChannelLinkChannelFragment } from '@gen';

interface Props {
  channel: SearchBoxChannelLinkChannelFragment;
  matchedProperties: string[];
  query: string;
  className?: string;
}

export function SearchBoxChannelLink({
  channel,
  className,
  matchedProperties,
  query,
}: Props) {
  const { id, name } = channel;

  const matchField = getChannelMatchedField(channel, matchedProperties);

  return (
    <PermissionLink
      className={className}
      to={generatePath('/channels/:channelId', { channelId: id })}
    >
      <ChannelLogo
        channel={channel}
        size="xs"
      />

      <div className={styles.channelDetails}>
        <HighlightedText
          query={query}
          text={name}
        />

        {matchField && matchField.field !== 'name' && (
          <div className={styles.matchRow}>
            <HighlightedText
              query={query}
              text={matchField.value}
            />
            <span>{matchField.field}</span>
          </div>
        )}
      </div>
    </PermissionLink>
  );
}

SearchBoxChannelLink.fragments = {
  entry: gql`
    fragment SearchBoxChannelLinkChannel on ChannelChannel {
      id
      name
      ...SearchMatchResultChannel
      ...ChannelLogoChannel
    }
  `,
};
