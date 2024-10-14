import { ReportType, UserRole } from '../ReportFlow/report-reasons';

import { ButtonLarge } from '@components/ButtonLarge';
import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { AuthenticatedScreenProps } from '@navigators/routes';

export const ChannelOptionsModal = ({
  navigation,
  route: { params },
}: AuthenticatedScreenProps<'channelOptionsModal'>) => {
  const { userId, channelId, streamId } = params;

  const reportStream = () => {
    navigation.replace('reportFlow', {
      reportType: ReportType.Livestream,
      userId: userId,
      userRole: UserRole.Creator,
      stream: {
        channelId,
        startAt: new Date().getTime(),
        streamId,
      },
    });
  };

  return (
    <FormSheetModalLayout>
      <ButtonLarge
        analyticsActionName="REPORT_STREAM"
        rounded={false}
        onPress={reportStream}
      >
        Report Stream
      </ButtonLarge>
    </FormSheetModalLayout>
  );
};
