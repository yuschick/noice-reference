import { Icons } from '@noice-com/assets-core/src';
import { Callout } from '@noice-com/common-ui';
import { useEffect } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router';

import { ChannelEmojis } from './ChannelEmojis/ChannelEmojis';
import { ChannelEmojisAdd } from './ChannelEmojisAdd/ChannelEmojisAdd';
import { ChannelEmojisEdit } from './ChannelEmojisEdit/ChannelEmojisEdit';
import { ChannelEmojiMaxAmountProvider } from './context';
import { useChannelEmoji } from './context/ChannelEmojiProvider';

import { useChannelContext } from '@common/channel';
import { Routes as AppRoutes, SubscriptionsSubRoutes } from '@common/route';

export function EmojisPage() {
  return (
    <ChannelEmojiMaxAmountProvider>
      <EmojisPageContent />
    </ChannelEmojiMaxAmountProvider>
  );
}

function EmojisPageContent() {
  const { isChannelSubscriptionEnabled } = useChannelEmoji();
  const { monetizationSettings } = useChannelContext();
  const navigate = useNavigate();
  const { channelName } = useParams();

  useEffect(() => {
    if (!monetizationSettings?.enabled) {
      navigate(`/${channelName}${AppRoutes.MonetizationSubscriptions}`, {
        replace: true,
      });
    }
  }, [channelName, monetizationSettings, navigate]);

  return (
    <>
      {!isChannelSubscriptionEnabled && (
        <Callout
          message="Channel emojis require subscriptions to be enabled."
          slots={{
            icon: Icons.Exclamation,
          }}
          theme="gray"
          type="error"
          variant="bordered"
        />
      )}
      <Routes>
        <Route
          element={<ChannelEmojis />}
          path="/"
        />

        <Route
          element={<ChannelEmojisAdd />}
          path={SubscriptionsSubRoutes.EmojiAdd}
        />

        <Route
          element={<ChannelEmojisEdit />}
          path={SubscriptionsSubRoutes.EmojiEdit}
        />

        <Route
          element={<div>404</div>}
          path="*"
        />
      </Routes>
    </>
  );
}
