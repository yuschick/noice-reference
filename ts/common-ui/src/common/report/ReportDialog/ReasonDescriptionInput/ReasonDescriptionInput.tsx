import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useMemo } from 'react';

import { ReportType } from '../../types';

import { TextArea } from '@common-components';
import {
  ReasonDescriptionInputChannelFragment,
  ReasonDescriptionInputProfileFragment,
} from '@common-gen';

gql`
  fragment ReasonDescriptionInputProfile on ProfileProfile {
    userTag
  }

  fragment ReasonDescriptionInputChannel on ChannelChannel {
    name
  }
`;

interface Props {
  reason: string;
  reportType: ReportType;
  user: Nullable<ReasonDescriptionInputProfileFragment>;
  channel: Nullable<ReasonDescriptionInputChannelFragment>;
  setDescription: (description: string) => void;
}

export const ReasonDescriptionInput = ({
  setDescription,
  reportType,
  reason,
  user,
  channel,
}: Props) => {
  const reportTargetLabel = useMemo(() => {
    if (reportType === ReportType.User) {
      if (user) {
        return `user ${user.userTag}'s profile`;
      }

      return "user's profile";
    }

    if (reportType === ReportType.ChannelChat) {
      return 'channel chat';
    }

    if (reportType === ReportType.Livestream) {
      return 'a livestream';
    }

    if (reportType === ReportType.Channel) {
      if (channel) {
        return `the ${channel.name} channel`;
      }
      return 'the channel';
    }
  }, [channel, reportType, user]);

  return (
    <>
      <div>
        <p>
          Almost ready to submit your report about &quot;{reason}&quot; you saw on&nbsp;
          {reportTargetLabel}.
        </p>
        <p>Is there anything else we should know as we review your report?</p>
      </div>

      <TextArea
        label="Type here..."
        maxLength={500}
        name="description"
        onChange={(event) => setDescription(event.target.value)}
      />
    </>
  );
};
