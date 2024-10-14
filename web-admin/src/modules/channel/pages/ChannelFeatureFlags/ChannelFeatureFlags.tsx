import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useParams } from 'react-router';

import { QueryTableModulePage } from '@common/page-components';
import {
  ChannelFeatureFlagsQuery,
  ChannelFeatureFlagsQueryVariables,
  useChannelFeatureFlagsQuery,
} from '@gen';

gql`
  query ChannelFeatureFlags($channelId: ID!) {
    channelFeatureFlags(channelId: $channelId) {
      flags {
        name
        value
      }
    }
  }
`;

export function ChannelFeatureFlags() {
  const { channelId } = useParams();

  const queryResult = useChannelFeatureFlagsQuery({
    ...variablesOrSkip({ channelId }),
  });

  return (
    <QueryTableModulePage<ChannelFeatureFlagsQuery, ChannelFeatureFlagsQueryVariables>
      caption="Feature Flags"
      dataTransform={dataTransform}
      queryResult={queryResult}
    />
  );
}

function dataTransform(data: ChannelFeatureFlagsQuery) {
  return (
    data.channelFeatureFlags?.flags.map(({ name, value }) => ({ name, value })) || []
  );
}
