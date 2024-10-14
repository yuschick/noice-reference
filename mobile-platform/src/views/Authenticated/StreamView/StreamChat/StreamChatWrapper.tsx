import { useBooleanFeatureFlag } from '@noice-com/common-react-core';
import { forwardRef } from 'react';

import { StreamChat as LegacyStreamChat } from './legacy/StreamChat';
import { Props, StreamChat } from './StreamChat';

import { ChatProvider } from '@providers/ChatProvider';

type StreamChatWrapperProps = Props;

export const StreamChatWrapper = forwardRef((props: StreamChatWrapperProps, ref) => {
  const [useCommonChatLogic, isFlagTypeLoading] = useBooleanFeatureFlag(
    'mobile_useCommonChatLogic',
    false,
  );

  if (isFlagTypeLoading) {
    return <></>;
  }

  return useCommonChatLogic ? (
    <ChatProvider
      channelId={props.channelId}
      streamChatId={props.chatId}
    >
      <StreamChat
        {...props}
        ref={ref}
      />
    </ChatProvider>
  ) : (
    <LegacyStreamChat
      {...props}
      ref={ref}
    />
  );
});
