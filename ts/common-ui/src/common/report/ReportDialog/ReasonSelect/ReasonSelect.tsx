import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { ReportType } from '../../types';
import { useReportReason } from '../context';
import { ReasonDescriptionInput } from '../ReasonDescriptionInput';
import { ReasonList } from '../ReasonList';

import { ReasonSelectChannelFragment, ReasonSelectProfileFragment } from '@common-gen';

gql`
  fragment ReasonSelectProfile on ProfileProfile {
    ...ReasonDescriptionInputProfile
  }

  fragment ReasonSelectChannel on ChannelChannel {
    ...ReasonDescriptionInputChannel
  }
`;

interface Props {
  reportType: ReportType;
  user: Nullable<ReasonSelectProfileFragment>;
  channel: Nullable<ReasonSelectChannelFragment>;
}

export function ReasonSelect({ reportType, user, channel }: Props) {
  const {
    onReasonSelect,
    visibleReasonList,
    selectedReasonIndex,
    report,
    setDescription,
  } = useReportReason();

  return visibleReasonList ? (
    <ReasonList
      reasonList={visibleReasonList}
      selectedReasonIndex={selectedReasonIndex}
      onReasonSelect={onReasonSelect}
    />
  ) : (
    <ReasonDescriptionInput
      channel={channel}
      reason={report.reasonText}
      reportType={reportType}
      setDescription={setDescription}
      user={user}
    />
  );
}
