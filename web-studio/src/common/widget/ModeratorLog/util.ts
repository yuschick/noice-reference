import { CoreAssets } from '@noice-com/assets-core';

import {
  ModerationEventContent,
  ModerationEventMeta,
  ModerationEventType,
} from './types';

import {
  ChannelAutomodItemAccepted,
  ChannelAutomodItemRejected,
  ChannelBanAppealAccepted,
  ChannelBanAppealRejected,
  ChannelModerationEventContentContentUnion,
  ChannelModerationEventType,
  ChannelUserBanned,
  ChannelUserMuted,
  ChannelViolation,
  ChatReason,
  ChatTextMessage,
  Maybe,
} from '@gen';

export type EventTypeFilter = (event: {
  content?: {
    content?: Maybe<Pick<ChannelModerationEventContentContentUnion, '__typename'>>;
  };
}) => boolean;
type GetEventTypeFilter = (eventTypes: ChannelModerationEventType[]) => EventTypeFilter;

/**
 * Doesn't include 'Unspecified' on purpose.
 */
export const groupedFilterTypes: Record<string, ChannelModerationEventType[]> = {
  ['User muting']: [ChannelModerationEventType.ModerationEventTypeUserMuted],
  ['User banning']: [
    ChannelModerationEventType.ModerationEventTypeUserBanned,
    ChannelModerationEventType.ModerationEventTypeUserUnbanned,
    ChannelModerationEventType.ModerationEventTypeBanAppealAccepted,
    ChannelModerationEventType.ModerationEventTypeBanAppealRejected,
  ],
  ['AutoMod']: [
    ChannelModerationEventType.ModerationEventTypeAutomodItemAccepted,
    ChannelModerationEventType.ModerationEventTypeAutomodItemRejected,
  ],
};

const moderationEventMeta: Record<string, Maybe<ModerationEventMeta>> = {
  ['ChannelBanAppealAccepted']: {
    color: 'positive',
    icon: CoreAssets.Icons.AppealAccept,
    title: 'User ban appeal accepted',
    type: ChannelModerationEventType.ModerationEventTypeBanAppealAccepted,
  },
  ['ChannelBanAppealRejected']: {
    color: 'negative',
    icon: CoreAssets.Icons.AppealReject,
    title: 'User ban appeal rejected',
    type: ChannelModerationEventType.ModerationEventTypeBanAppealRejected,
  },
  ['ChannelUserBanned']: {
    color: 'negative',
    icon: CoreAssets.Icons.Ban,
    title: 'User banned',
    type: ChannelModerationEventType.ModerationEventTypeUserBanned,
  },
  ['ChannelUserMuted']: {
    color: 'warn',
    icon: CoreAssets.Icons.Muted,
    title: 'User muted',
    type: ChannelModerationEventType.ModerationEventTypeUserMuted,
  },
  ['ChannelUserUnbanned']: {
    color: 'positive',
    icon: CoreAssets.Icons.UnBan,
    title: 'User unbanned',
    type: ChannelModerationEventType.ModerationEventTypeUserUnbanned,
  },
  ['ChannelAutomodItemAccepted']: {
    color: 'positive',
    icon: CoreAssets.Icons.AutoMod,
    title: 'AutoMod item accepted',
    type: ChannelModerationEventType.ModerationEventTypeAutomodItemAccepted,
  },
  ['ChannelAutomodItemRejected']: {
    color: 'negative',
    icon: CoreAssets.Icons.AutoMod,
    title: 'AutoMod item rejected',
    type: ChannelModerationEventType.ModerationEventTypeAutomodItemRejected,
  },
};

const muteReasonLabel: Record<ChatReason, string> = {
  [ChatReason.ReasonOther]: 'other',
  [ChatReason.ReasonSpam]: 'spam',
  [ChatReason.ReasonUnspecified]: 'unspecified',
};

const violationLabel: Record<ChannelViolation, string> = {
  [ChannelViolation.ViolationOther]: 'other',
  [ChannelViolation.ViolationSpam]: 'spam',
  [ChannelViolation.ViolationUnspecified]: 'unspecified',
};

export function getModerationEventMeta(
  content?: Maybe<ModerationEventType>,
): Maybe<ModerationEventMeta> {
  if (!content) {
    return null;
  }

  const typeName = content.__typename;

  if (!typeName) {
    return null;
  }

  const eventMeta = moderationEventMeta[typeName];

  if (!eventMeta) {
    return null;
  }

  if (typeName === 'ChannelUserMuted') {
    return {
      ...eventMeta,
      title: eventMeta.title + ' for ' + (content as ChannelUserMuted).duration,
    } as ModerationEventMeta;
  }

  return eventMeta;
}

export function getModerationEventDescription(
  content?: ModerationEventType,
): Maybe<ModerationEventContent> {
  if (!content) {
    return null;
  }

  if (!content.__typename) {
    return null;
  }

  const out: ModerationEventContent = {
    user: content.user,
    message: null,
    summary: null,
  };

  if (content?.__typename === 'ChannelUserMuted') {
    const { description, reason } = content as ChannelUserMuted;

    return { ...out, message: description, summary: muteReasonLabel[reason] };
  }

  if (content?.__typename === 'ChannelUserBanned') {
    const { description, violation } = content as ChannelUserBanned;

    return { ...out, message: description, summary: violationLabel[violation] };
  }

  if (content?.__typename === 'ChannelBanAppealAccepted') {
    return { ...out, message: (content as ChannelBanAppealAccepted).comment };
  }

  if (content?.__typename === 'ChannelBanAppealRejected') {
    return { ...out, message: (content as ChannelBanAppealRejected).comment };
  }

  if (content?.__typename === 'ChannelAutomodItemAccepted') {
    return {
      ...out,
      message: (
        (content as ChannelAutomodItemAccepted).message.content as ChatTextMessage
      ).text,
    };
  }

  if (content?.__typename === 'ChannelAutomodItemRejected') {
    return {
      ...out,
      message: (
        (content as ChannelAutomodItemRejected).message.content as ChatTextMessage
      ).text,
    };
  }

  return out;
}

export function isIncludedEvent(
  typeName: string,
  eventTypes: ChannelModerationEventType[],
) {
  const meta = moderationEventMeta[typeName];

  return !meta ? false : eventTypes.includes(meta.type);
}

export const getEventTypeFilter: GetEventTypeFilter = (eventTypes) => {
  const allowedTypeNames = Object.keys(moderationEventMeta).filter((typeName) =>
    isIncludedEvent(typeName, eventTypes),
  );

  return ({ content }): boolean =>
    !!content?.content?.__typename &&
    allowedTypeNames.includes(content.content.__typename);
};
