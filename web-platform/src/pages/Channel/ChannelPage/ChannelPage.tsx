import { gql } from '@apollo/client';
import { useAuthentication } from '@noice-com/common-ui';

import { ChannelPageContent } from '../ChannelPageContent';
import { ChannelStreamProvider } from '../context';

import { useChannelPageChannelQuery } from '@gen';
import { NotFound } from '@pages/NotFound';

gql`
  query ChannelPageChannel($channelId: ID!, $skipAuthFields: Boolean!) {
    channel(id: $channelId) {
      id
      ...ChannelPageContentChannel
      ...ChannelStreamContextChannel
    }
  }
`;

interface Props {
  channelId: string;
}

export function ChannelPage({ channelId }: Props) {
  const { userId } = useAuthentication();
  const { data, loading } = useChannelPageChannelQuery({
    variables: { channelId, skipAuthFields: !userId },
  });

  const channel = data?.channel ?? null;

  if (loading) {
    return <ChannelPageContent.Loading />;
  }

  if (!channel) {
    return <NotFound />;
  }

  return (
    <ChannelStreamProvider channel={channel}>
      <ChannelPageContent channel={channel} />
    </ChannelStreamProvider>
  );
}
