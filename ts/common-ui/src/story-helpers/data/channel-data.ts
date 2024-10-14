import { CoreAssets } from '@noice-com/assets-core';

import { getNewId } from '../helpers';

import { ChannelChannel, ChannelLiveStatus } from '@common-gen';

type WithoutId = Omit<Partial<ChannelChannel>, 'id'>;

const channels: WithoutId[] = [
  {
    description:
      'Do sunt adipisicing laboris nisi ea ex est dolore culpa minim irure nisi sit nostrud. Excepteur et enim anim excepteur esse incididunt non minim aute. Esse labore ea culpa do elit. Do proident laborum consequat veniam dolore do minim.',
    followerCount: 6545,
    liveStatus: ChannelLiveStatus.LiveStatusLive,
    logo: CoreAssets.Images.StreamerLogo,
    name: 'OrionV7',
    subscriberCount: 1,
    title: 'Super noice game going on!!',
    viewerCount: 930,
  },
  {
    description:
      'Laboris do elit qui incididunt sint veniam est adipisicing. Nisi velit ex deserunt ea irure magna sint aliquip qui ipsum ullamco. Eiusmod aute esse incididunt esse. Ipsum Lorem consequat cillum qui ullamco aliquip non minim nulla voluptate cillum deserunt. Duis nisi incididunt occaecat nisi veniam nulla. Do esse id aliqua consequat sunt qui esse est id. Consequat tempor officia culpa quis eiusmod occaecat anim incididunt velit consequat labore consectetur.',
    followerCount: 6545,
    liveStatus: ChannelLiveStatus.LiveStatusLive,
    logo: CoreAssets.Images.StreamerLogo,
    name: 'Catjam',
    subscriberCount: 1,
    title: 'Chilling and gaming',
    viewerCount: 930,
  },
  {
    description: 'Sic transit gloria mundi.',
    followerCount: 123,
    liveStatus: ChannelLiveStatus.LiveStatusOffline,
    logo: CoreAssets.Images.StreamerLogo,
    name: 'Jatcam',
    subscriberCount: 1,
    title: 'Oh my',
    viewerCount: 1234,
  },
];

function* channelGenFn(): Generator<WithoutId> {
  let index = 0;

  while (true) {
    yield channels[index++ % channels.length];
  }
}

const channelGen = channelGenFn();

// The function always gets the next channel from the array above. If last one asked
// was the last, then first one is returned again
export const getNewChannel = <T extends Partial<ChannelChannel>>(): T => ({
  ...channelGen.next().value,
  id: `${getNewId()}`,
});
