import { gql } from '@apollo/client';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  Placement,
  shift,
} from '@floating-ui/dom';
import { useMountEffect } from '@noice-com/common-react-core';
import {
  useAuthenticatedUser,
  useKeyPress,
  useOnOutsideClick,
  ReportChatUserDialog,
} from '@noice-com/common-ui';
import { KeyboardKeys } from '@noice-com/utils';
import {
  ComponentProps,
  RefObject,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { BlockUserModal } from '../BlockUserModal';
import { ChannelBanModal } from '../ChannelBanModal';
import { ChannelMuteModal } from '../ChannelMuteModal/ChannelMuteModal';
import { ChannelUnbanModal } from '../ChannelUnbanModal/ChannelUnbanModal';
import { ChannelUnmuteModal } from '../ChannelUnmuteModal/ChannelUnmuteModal';

import { MiniProfileProvider } from './context/MiniProfileProvider';
import { MiniProfile } from './MiniProfile';
import styles from './MiniProfilePortal.module.css';
import { Modal } from './types';

import {
  ChannelChannelRole,
  useMiniProfileLazyQuery,
  useMiniProfileModeratorStatusLazyQuery,
  useUserChannelRolesQuery,
} from '@social-gen';

gql`
  query MiniProfile($userId: ID!, $channelId: ID) {
    profile(userId: $userId) {
      userId
      friendshipStatus {
        status
      }
      badges(channel_id: $channelId) {
        ...UserBadge
      }
      ...MiniProfile
      ...ChannelBanModalProfile
      ...ChannelUnbanModalProfile
      ...ChannelMuteModalProfile
      ...ChannelUnmuteModalProfile
    }
  }

  query MiniProfileModeratorStatus(
    $userId: ID!
    $channelId: ID!
    $chatId: ID
    $skipChatModerationData: Boolean!
  ) {
    channelBanUserStatus(userId: $userId, channelId: $channelId) {
      userId
      channelId
      banned
      ...MiniProfilePortalChannelBan
    }

    chatUserStatus(userId: $userId, chatId: $chatId) @skip(if: $skipChatModerationData) {
      ...MiniProfilePortalChatStaus
    }
  }

  fragment MiniProfilePortalChannelBan on ChannelUserBanStatus {
    ...MiniProfileChannelBan
    ...ChannelUnbanModalChannelUserBanStatus
  }

  fragment MiniProfilePortalChatStaus on ChatGetChatUserStatusResponse {
    ...MiniProfileChatStatus
    ...ChannelUnmuteModalChatStatus
  }

  query UserChannelRoles($userId: ID, $channelId: ID!, $skipRoles: Boolean!) {
    userChannelRoles(userId: $userId, channelId: $channelId) @skip(if: $skipRoles) {
      roles
    }

    channel(id: $channelId) {
      id
      currentChatId
    }
  }
`;

interface Props {
  showMiniProfile: boolean;
  userId: string;
  channelId?: string;
  placement?: Placement;
  anchor: RefObject<HTMLElement>;
  reportContext?: Omit<
    ComponentProps<typeof ReportChatUserDialog>,
    'reportedUserId' | 'onDismiss'
  >;
  onModerationAction?(
    message: string,
    username: string,
    state: 'success' | 'error',
  ): void;
  onClose(): void;
}

export function MiniProfilePortal({
  showMiniProfile,
  userId,
  channelId,
  placement,
  anchor,
  onClose,
  reportContext,
  onModerationAction,
}: Props) {
  const { userId: currentUserId, hasRole } = useAuthenticatedUser();
  const id = useId();
  const [showModal, setShowModal] = useState<Modal | null>(null);
  const miniProfileRef = useRef<HTMLDivElement>(null);
  const cleanup = useRef<ReturnType<typeof autoUpdate>>();

  const [fetchProfile, { data }] = useMiniProfileLazyQuery();

  const [fetchModeratorStatus, { data: moderatorStatusData }] =
    useMiniProfileModeratorStatusLazyQuery({
      fetchPolicy: 'cache-and-network',
    });

  const isUserNoiceStaff = hasRole('admin') || hasRole('px_agent');
  const { data: currentUserRolesData } = useUserChannelRolesQuery({
    variables: {
      userId: currentUserId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      channelId: channelId!,
      skipRoles: !!isUserNoiceStaff,
    },
    skip: !channelId,
  });

  const chatId = currentUserRolesData?.channel?.currentChatId;

  const showModerationButtons =
    (!!channelId && isUserNoiceStaff) ||
    !!currentUserRolesData?.userChannelRoles?.roles.some((role) =>
      [
        ChannelChannelRole.ChannelRoleModerator,
        ChannelChannelRole.ChannelRoleStreamer,
      ].includes(role),
    );

  const createFloatingUi = useCallback(async () => {
    if (!anchor.current || !miniProfileRef.current) {
      return;
    }

    const { x, y } = await computePosition(anchor.current, miniProfileRef.current, {
      strategy: 'fixed',
      placement: placement,
      middleware: [
        // Offsets the panel from the anchor
        offset({
          crossAxis: 0,
          mainAxis: 4,
        }),
        // Make sure the mini profile does not go off screen on left/right
        shift(),
        // Make sure the mini profile does not go off screen on top/bottom
        flip(),
      ],
    });

    Object.assign(miniProfileRef.current.style, {
      insetInlineStart: `${x}px`,
      insetBlockStart: `${y}px`,
    });
  }, [anchor, placement]);

  useEffect(() => {
    if (!anchor.current) {
      return;
    }

    if (anchor.current.tagName === 'BUTTON') {
      anchor.current.setAttribute('aria-haspopup', 'dialog');
      anchor.current.setAttribute('aria-controls', id);
      anchor.current.setAttribute('aria-expanded', showMiniProfile ? 'true' : 'false');
    }
  }, [anchor, id, showMiniProfile]);

  useLayoutEffect(() => {
    if (!showMiniProfile) {
      cleanup.current?.();
      return;
    }

    if (!userId || !anchor?.current || !miniProfileRef.current) {
      return;
    }

    fetchProfile({
      variables: {
        userId,
        channelId,
      },
    });

    if (showModerationButtons && channelId) {
      fetchModeratorStatus({
        variables: {
          userId,
          channelId,
          chatId,
          skipChatModerationData: !chatId,
        },
      });
    }

    cleanup.current = autoUpdate(
      anchor.current,
      miniProfileRef.current,
      createFloatingUi,
      {
        // Keeps position fixed even when container is scrolled
        ancestorScroll: false,
        layoutShift: false,
      },
    );
  }, [
    anchor,
    channelId,
    chatId,
    createFloatingUi,
    fetchModeratorStatus,
    fetchProfile,
    showMiniProfile,
    showModerationButtons,
    userId,
  ]);

  useMountEffect(() => {
    return () => {
      cleanup.current?.();
    };
  });

  const onOutsideClick = (event: MouseEvent) => {
    if (anchor?.current?.contains(event.target as Node)) {
      return;
    }
    onClose();
  };

  useOnOutsideClick(miniProfileRef, onOutsideClick, { exempt: ['portals'] });

  useKeyPress(KeyboardKeys.Escape, onClose);

  const portalElement = document.getElementById('portals');

  if (!portalElement) {
    throw new Error("Can't find mini profile portal element");
  }

  return (
    <>
      {createPortal(
        <MiniProfileProvider
          badges={data?.profile?.badges ?? []}
          channelBan={moderatorStatusData?.channelBanUserStatus ?? null}
          channelId={channelId ?? null}
          chatStatus={moderatorStatusData?.chatUserStatus ?? null}
          hasReportContext={!!reportContext}
          setShowModal={setShowModal}
          showChatModerationButtons={!!chatId}
          showModerationButtons={showModerationButtons}
          onClose={onClose}
        >
          {showMiniProfile && (
            <div
              className={styles.wrapper}
              id={id}
              ref={miniProfileRef}
            >
              {data?.profile && <MiniProfile profile={data.profile} />}
            </div>
          )}

          {showModal === Modal.Block && (
            <BlockUserModal
              blockedUserId={userId}
              onDismiss={() => setShowModal(null)}
            />
          )}

          {showModal === Modal.ReportUser && reportContext && (
            <ReportChatUserDialog
              {...reportContext}
              reportedUserId={userId}
              onDismiss={() => setShowModal(null)}
            />
          )}

          {showModal === Modal.ChannelBan && data?.profile && !!channelId && (
            <ChannelBanModal
              channelId={channelId}
              profile={data.profile}
              onClose={() => setShowModal(null)}
              onModerationAction={onModerationAction}
            />
          )}

          {showModal === Modal.ChannelUnban &&
            data?.profile &&
            !!channelId &&
            moderatorStatusData?.channelBanUserStatus && (
              <ChannelUnbanModal
                channelId={channelId}
                profile={data.profile}
                onClose={() => setShowModal(null)}
                onModerationAction={onModerationAction}
              />
            )}

          {showModal === Modal.ChannelMute && data?.profile && !!chatId && (
            <ChannelMuteModal
              chatId={chatId}
              profile={data.profile}
              onClose={() => setShowModal(null)}
              onModerationAction={onModerationAction}
            />
          )}

          {showModal === Modal.ChannelUnmute && data?.profile && !!chatId && (
            <ChannelUnmuteModal
              chatId={chatId}
              profile={data.profile}
              onClose={() => setShowModal(null)}
              onModerationAction={onModerationAction}
            />
          )}
        </MiniProfileProvider>,
        portalElement,
      )}
    </>
  );
}
