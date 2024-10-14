import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useNavigate, useParams } from 'react-router';

import { Routes, getChannelStoreLink } from '@common/route';
import { StoreItemPage } from '@common/sellable-item';
import { useChannelStoreItemChannelQuery } from '@gen';

gql`
  query ChannelStoreItemChannel($channelName: String!) {
    channelByName(name: $channelName) {
      id
      ...StoreItemPageChannel
    }
  }
`;

export function ChannelStoreItem() {
  const { storeItemId, channelName } = useParams();
  const navigate = useNavigate();

  const { loading, data } = useChannelStoreItemChannelQuery({
    ...variablesOrSkip({ channelName }),
  });

  if (loading) {
    return null;
  }

  const channel = data?.channelByName ?? null;

  if (!storeItemId || !channelName || !channel) {
    if (!channel?.name) {
      navigate(Routes.NotFound, { replace: true });
      return null;
    }

    navigate(getChannelStoreLink({ channel }), { replace: true });
    return null;
  }

  return (
    <StoreItemPage
      channel={channel}
      storeItemId={storeItemId}
    />
  );
}
