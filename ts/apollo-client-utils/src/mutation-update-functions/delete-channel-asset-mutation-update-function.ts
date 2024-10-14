import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationUpdaterFunction,
} from '@apollo/client';
import { DeepPartial } from '@noice-com/utils';

import { ChannelAssetType, ChannelChannel, Exact, Scalars } from '../../gen';

export const deleteChannelAssetMutationUpdateFunction: MutationUpdaterFunction<
  any,
  Exact<{
    channelId: Scalars['ID']['input'];
    assetType: ChannelAssetType;
  }>,
  DefaultContext,
  ApolloCache<any>
> = (cache, _result, { variables }) => {
  if (variables?.assetType === ChannelAssetType.AssetTypeLogo) {
    cache.updateFragment<DeepPartial<ChannelChannel>>(
      {
        id: cache.identify({ id: variables.channelId, __typename: 'ChannelChannel' }),
        fragment: gql`
          fragment LogoUpdateChannelChannel on ChannelChannel {
            id
            logo
          }
        `,
      },
      (data) => ({ ...data, logo: '' }),
    );
  }

  if (variables?.assetType === ChannelAssetType.AssetTypeBanner) {
    cache.updateFragment<DeepPartial<ChannelChannel>>(
      {
        id: cache.identify({ id: variables.channelId, __typename: 'ChannelChannel' }),
        fragment: gql`
          fragment BannerUpdateChannelChannel on ChannelChannel {
            id
            offlineBanner
          }
        `,
      },
      (data) => ({ ...data, offlineBanner: '' }),
    );
  }
};
