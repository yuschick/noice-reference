import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { Helmet } from 'react-helmet-async';

interface Props {
  channelName: Nullable<string>;
}

export function ChannelWrapper({ channelName, children }: WithChildren<Props>) {
  return (
    <>
      <Helmet>{!!channelName && <title>{channelName}</title>}</Helmet>

      {children}
    </>
  );
}
