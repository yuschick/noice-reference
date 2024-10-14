import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import { Modal } from '../types';

import {
  MiniProfilePortalChannelBanFragment,
  MiniProfilePortalChatStausFragment,
  UserBadgeFragment,
} from '@social-gen';

interface Context {
  channelId: Nullable<string>;
  showModerationButtons: boolean;
  showChatModerationButtons: boolean;
  chatStatus: Nullable<MiniProfilePortalChatStausFragment>;
  channelBan: Nullable<MiniProfilePortalChannelBanFragment>;
  badges: UserBadgeFragment[];
  onReportUser?(): void;
  onBlockUser(): void;
  onChannelBanUser(): void;
  onChannelUnbanUser(): void;
  onChannelMuteUser(): void;
  onChannelUnmuteUser(): void;
  onClose(): void;
}

const MiniProfileContext = createContext<Nullable<Context>>(null);

interface Props
  extends Pick<
    Context,
    | 'channelId'
    | 'chatStatus'
    | 'channelBan'
    | 'showChatModerationButtons'
    | 'showModerationButtons'
    | 'badges'
  > {
  hasReportContext: boolean;
  onClose(): void;
  setShowModal(modal: Modal): void;
}

export function MiniProfileProvider({
  children,
  channelBan,
  chatStatus,
  showChatModerationButtons,
  showModerationButtons,
  badges,
  onClose,
  setShowModal,
  channelId,
  hasReportContext,
}: WithChildren<Props>) {
  const onBlockUser = () => {
    setShowModal(Modal.Block);
    onClose();
  };

  const onReportUser = hasReportContext
    ? () => {
        setShowModal(Modal.ReportUser);
        onClose();
      }
    : undefined;

  const onChannelBanUser = () => {
    setShowModal(Modal.ChannelBan);
    onClose();
  };

  const onChannelUnbanUser = () => {
    setShowModal(Modal.ChannelUnban);
    onClose();
  };

  const onChannelMuteUser = () => {
    setShowModal(Modal.ChannelMute);
    onClose();
  };

  const onChannelUnmuteUser = () => {
    setShowModal(Modal.ChannelUnmute);
    onClose();
  };

  return (
    <MiniProfileContext.Provider
      value={{
        channelId,
        channelBan,
        chatStatus,
        onBlockUser,
        onChannelBanUser,
        onChannelMuteUser,
        onChannelUnbanUser,
        onChannelUnmuteUser,
        onReportUser,
        showChatModerationButtons: showChatModerationButtons && !channelBan?.banned,
        showModerationButtons,
        badges,
        onClose,
      }}
    >
      {children}
    </MiniProfileContext.Provider>
  );
}

export function useMiniProfileContext(): Context {
  const context = useContext(MiniProfileContext);

  if (!context) {
    throw new Error('Trying to access mini profile context without MiniProfileProvider');
  }

  return context;
}
