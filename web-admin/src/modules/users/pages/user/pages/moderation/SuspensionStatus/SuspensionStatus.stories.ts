import { StoryHelpers } from '@noice-com/common-ui';

import { SuspensionStatus } from './SuspensionStatus';

import { ModerationAppealStatus, ModerationViolation } from '@gen';

export default {
  title: 'User/SuspensionStatus',
  component: SuspensionStatus,
  argTypes: {},
};

export const Default = {
  args: {
    platformSuspension: null,
  },
};

export const Suspended = {
  args: {
    platformSuspension: {
      appeal: null,
      expiresAt: '2021-06-01T00:00:00.000Z',
      bannedAt: '2021-05-01T00:00:00.000Z',
      violation: ModerationViolation.ViolationSpam,
      description: 'Spamming the platform with nonsense',
      moderator: StoryHelpers.getNewProfile(),
    },
  },
};

export const SuspendedWithAppeal = {
  args: {
    platformSuspension: {
      expiresAt: '2021-06-01T00:00:00.000Z',
      bannedAt: '2021-05-01T00:00:00.000Z',
      violation: ModerationViolation.ViolationSpam,
      description: 'Spamming the platform with nonsense',
      moderator: StoryHelpers.getNewProfile(),
      appeal: {
        banId: 'id',
        status: ModerationAppealStatus.AppealStatusPending,
        reviewer: null,
        reviewerComment: '',
      },
    },
  },
};

export const SuspendedWithAppealRejected = {
  args: {
    platformSuspension: {
      expiresAt: '2021-06-01T00:00:00.000Z',
      bannedAt: '2021-05-01T00:00:00.000Z',
      violation: ModerationViolation.ViolationSpam,
      description: 'Spamming the platform with nonsense',
      moderator: StoryHelpers.getNewProfile(),
      appeal: {
        banId: 'id',
        status: ModerationAppealStatus.AppealStatusDeclined,
        reviewer: StoryHelpers.getNewProfile(),
        reviewerComment: 'Appeal was more vulgar than the original post',
        closedAt: '2021-08-01T00:00:00.000Z',
      },
    },
  },
};
