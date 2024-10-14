import { gql } from '@apollo/client';
import { DateAndTimeUtils } from '@noice-com/utils';

import { ContentModulePage } from '@common/page-components';
import { UsernameTableCell } from '@common/profile';
import { ModerationEventsProfileUsernameChangeFragment, ModerationViolation } from '@gen';

gql`
  fragment ModerationEventsProfileUsernameChange on ProfileUsernameChange {
    oldUsername
    changedAt
    reason
    changer {
      userId
      ...UsernameTableCellProfile
    }
  }
`;

interface Props {
  moderationEvents: ModerationEventsProfileUsernameChangeFragment[];
}

export function ModerationEvents({ moderationEvents }: Props) {
  const data =
    moderationEvents?.map((item) =>
      (({ changedAt, oldUsername, reason, changer }) => ({
        date: DateAndTimeUtils.getShortDate(changedAt),
        moderator: !!changer && <UsernameTableCell profile={changer} />,
        eventType:
          reason === ModerationViolation.ViolationUnspecified
            ? 'Username change'
            : 'Username rejection',
        details: `${
          reason === ModerationViolation.ViolationUnspecified
            ? 'Old username'
            : 'Rejected username'
        }: ${oldUsername}`,
      }))(item),
    ) ?? [];

  return (
    <ContentModulePage.TableContent
      data={data}
      title="Moderation events"
    />
  );
}
