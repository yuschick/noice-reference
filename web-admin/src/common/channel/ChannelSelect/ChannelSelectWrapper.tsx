import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { ChannelSelect } from './ChannelSelect';

import { ChannelSelectChannelFragment, useChannelSelectSearchQuery } from '@gen';

gql`
  query ChannelSelectSearch($query: String) {
    search(query: $query, entityTypes: [ENTITY_TYPE_CHANNEL], cursor: { first: 5 }) {
      resultItems {
        entityId
        ...ChannelSelectResultItem
      }
    }
  }
`;

interface Props {
  label: string;
  /** Defaults to medium */
  size?: 'small' | 'medium';
  hasError?: boolean;
  className?: string;
  required?: boolean;
  excludeOptions?: string[];
  onSelect(channelId: string): void;
  onBlur?(): void;
}

export function ChannelSelectWrapper({
  label,
  size,
  hasError,
  className,
  excludeOptions,
  onSelect: onSelectProp,
  onBlur,
  required,
}: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Nullable<ChannelSelectChannelFragment>>(null);

  const { data } = useChannelSelectSearchQuery({
    variables: { query },
    skip: !query,
  });

  const onSelect = (id: string) => {
    const channel = data?.search?.resultItems.find(
      (item) => item.entity?.__typename === 'ChannelChannel' && item.entity.id === id,
    );

    if (!channel) {
      return;
    }

    setSelected(channel?.entity as ChannelSelectChannelFragment);
    onSelectProp(id);
  };

  return (
    <ChannelSelect
      className={className}
      hasError={hasError}
      label={label}
      query={query}
      required={required}
      results={
        data?.search?.resultItems.filter(
          ({ entityId }) => !excludeOptions?.includes(entityId),
        ) ?? []
      }
      selected={selected}
      size={size}
      onBlur={onBlur}
      onChange={setQuery}
      onSelect={onSelect}
    />
  );
}
