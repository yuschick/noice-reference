import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { validate } from 'uuid';

import { ProfileSelect } from './ProfileSelect';

import {
  ProfileSelectProfileFragment,
  useDefaultValueProfileSelectLazyQuery,
  useProfileSelectSearchQuery,
} from '@gen';

gql`
  query ProfileSelectSearch($query: String) {
    search(query: $query, entityTypes: [ENTITY_TYPE_USER], cursor: { first: 5 }) {
      resultItems {
        entityId
        ...ProfileSelectResultItem
      }
    }
  }
`;

gql`
  query DefaultValueProfileSelect($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...ProfileSelectProfile
    }
  }
`;

interface Props {
  excludeOptions?: string[];
  label: string;
  /** Defaults to medium */
  size?: 'small' | 'medium';
  hasError?: boolean;
  className?: string;
  defaultValue?: string;
  onSelect(userId: string, isNotSearchResult?: boolean): void;
  onBlur?(): void;
}

export function ProfileSelectWrapper({
  label,
  size,
  hasError,
  className,
  defaultValue,
  excludeOptions,
  onSelect: onSelectProp,
  onBlur,
}: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Nullable<ProfileSelectProfileFragment>>(null);

  const { data } = useProfileSelectSearchQuery({
    variables: { query },
    skip: !query,
  });

  const [getDefaultValueProfile] = useDefaultValueProfileSelectLazyQuery();

  const onSelect = (userId: string) => {
    const user = data?.search?.resultItems.find(
      (item) =>
        item.entity?.__typename === 'ProfileProfile' && item.entity.userId === userId,
    );

    if (!user) {
      if (validate(userId)) {
        onSelectProp(userId, true);
      }

      return;
    }

    setSelected(user?.entity as ProfileSelectProfileFragment);
    onSelectProp(userId);
  };

  useEffect(() => {
    if (!defaultValue || excludeOptions?.includes(defaultValue)) {
      return;
    }

    const getDefaultProfile = async (userId: string) => {
      const defaultProfile = await getDefaultValueProfile({
        variables: { userId },
      });

      if (defaultProfile.data?.profile) {
        setSelected(defaultProfile.data.profile);
        onSelectProp(defaultProfile.data.profile.userId);
      }
    };

    getDefaultProfile(defaultValue);
  }, [defaultValue, excludeOptions, getDefaultValueProfile, onSelectProp]);

  return (
    <ProfileSelect
      className={className}
      hasError={hasError}
      label={label}
      query={query}
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
