import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { SearchMatchField } from './types';

// Prevent circular dependency
import { hideEmailDomain } from '@common/profile/utils';
import { SearchMatchResultChannelFragment, SearchMatchResultProfileFragment } from '@gen';

export const getChannelMatchedField = (
  channel: SearchMatchResultChannelFragment,
  matchedProperties: string[],
): Nullable<SearchMatchField> => {
  if (matchedProperties.includes('name')) {
    return {
      field: 'name',
      value: channel.name,
    };
  }

  const firstMatch = matchedProperties[0];

  if (firstMatch === 'email') {
    return {
      field: 'Owner',
      value: hideEmailDomain(channel.streamer.account?.email ?? ''),
    };
  }

  if (firstMatch === 'userTag') {
    return {
      field: 'Owner',
      value: channel.streamer.userTag,
    };
  }

  if (firstMatch === 'title') {
    return {
      field: 'Title',
      value: channel.title,
    };
  }

  return null;
};

export const getUserMatchedField = (
  profile: SearchMatchResultProfileFragment,
  matchedProperties: string[],
): Nullable<SearchMatchField> => {
  if (matchedProperties.includes('userTag')) {
    return {
      field: 'userTag',
      value: profile.userTag,
    };
  }

  const firstMatch = matchedProperties[0];

  if (firstMatch === 'email') {
    return {
      field: 'Email address',
      value: hideEmailDomain(profile.account?.email ?? ''),
    };
  }

  if (firstMatch === 'bio') {
    return {
      field: 'Bio',
      value: profile.bio.slice(0, 15),
    };
  }

  if (firstMatch === 'userId') {
    return {
      field: 'User ID',
      value: profile.userId,
    };
  }

  return null;
};

gql`
  fragment SearchMatchResultChannel on ChannelChannel {
    name
    title
    streamer {
      userId
      userTag
      account {
        email
      }
    }
  }

  fragment SearchMatchResultProfile on ProfileProfile {
    userId
    bio
    userTag
    account {
      email
    }
  }
`;
