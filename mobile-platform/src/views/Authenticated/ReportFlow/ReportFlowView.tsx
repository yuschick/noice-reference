import { gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Details } from './components/Details';
import { ReasonList } from './components/ReasonList';
import { ReportHeader } from './components/ReportHeader';
import { Submitted } from './components/Submitted';
import {
  ReasonTree,
  ReportType,
  TreeNode,
  getChatTree,
  getLivestreamTree,
} from './report-reasons';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { HEADER_BOTTOM_ROW_HEIGHT } from '@components/List/Header';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { borderRadius, colors } from '@constants/styles';
import { SupportReportReason, useReportUserMutation } from '@gen/graphql';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { IconAssets } from '@utils/icons';

type Step = 'options-1' | 'options-2' | 'details' | 'submitted';

type FormState = {
  selectedReason: SupportReportReason | null;
  selectedReasonLabel: string;
  additionalDetails: string | undefined;
  step: Step | undefined;
};

gql`
  query ReportedStreamerProfile($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      logo
    }
  }
  mutation ReportUser(
    $reason: SupportReportReason!
    $description: String
    $context: SupportReportContextInput!
  ) {
    createReport(reason: $reason, description: $description, context: $context) {
      createdAt
    }
  }
`;

export const ReportFlowView = ({
  route: { params },
}: AuthenticatedScreenProps<'reportFlow'>) => {
  const { userRole, reportType, userId, stream, chatMessage } = params;
  const { bottom } = useSafeAreaInsets();
  const [reportUser] = useReportUserMutation();

  const [reasonTree] = useState<ReasonTree<TreeNode[]>>(
    reportType === ReportType.Livestream
      ? getLivestreamTree(userRole)
      : getChatTree(userRole),
  );

  // Reason list vs visible reason list
  // Reason list is one step further than the visible reason list so that user can click next to move to it
  // Visible reason list is the current list of reasons that are visible
  const [reasonList, setReasonList] = useState<ReasonTree<TreeNode[]> | null>(reasonTree);
  const [visibleReasonList, setVisibleReasonList] = useState<ReasonTree<
    TreeNode[]
  > | null>(reasonTree);

  const [{ selectedReason, additionalDetails, step, selectedReasonLabel }, setFormState] =
    useState<FormState>({
      selectedReason: null,
      additionalDetails: '',
      step: 'options-1',
      selectedReasonLabel: '',
    });

  const setReason = (reason: SupportReportReason | null, label: string) => {
    setFormState((state) => ({
      ...state,
      selectedReason: reason,
      selectedReasonLabel: label,
    }));
  };

  const setAdditionalDetails = (details: string) => {
    setFormState((state) => ({
      ...state,
      additionalDetails: details,
    }));
  };

  const canGoNext = () => {
    switch (step) {
      case 'options-1':
      case 'options-2':
        return selectedReason !== null;
      case 'details':
        return true;
    }
  };

  const handleNext = () => {
    switch (step) {
      case 'options-1':
        setFormState((state) => ({
          ...state,
          step: 'options-2',
        }));
        setVisibleReasonList(reasonList);
        break;
      case 'options-2':
        setFormState((state) => ({
          ...state,
          step: 'details',
        }));
        break;
      case 'details':
        reportReasonSubmit();
    }
  };

  const handleCancel = () => {
    switch (step) {
      case 'options-1':
        // reset reason list
        setVisibleReasonList(
          reportType === ReportType.Livestream
            ? getLivestreamTree(userRole)
            : getChatTree(userRole),
        );

        setFormState((state) => ({
          ...state,
          step: 'options-1',
          selectedReason: null,
          selectedReasonLabel: '',
        }));
        break;

      case 'options-2':
        // reset reason list
        setVisibleReasonList(
          reportType === ReportType.Livestream
            ? getLivestreamTree(userRole)
            : getChatTree(userRole),
        );
        setFormState((state) => ({
          ...state,
          step: 'options-1',
          selectedReason: null,
          selectedReasonLabel: '',
        }));

        break;

      case 'details':
        setFormState((state) => ({
          ...state,
          step: 'options-2',
          selectedReason: SupportReportReason.ReportReasonUnspecified,
          selectedReasonLabel: '',
        }));
        break;
    }
  };

  const reportReasonSubmit = () => {
    try {
      switch (reportType) {
        case ReportType.ChannelChat:
          reportUser({
            variables: {
              reason: selectedReason ?? SupportReportReason.ReportReasonUnspecified,
              description: additionalDetails,
              context: {
                chatMessage: { ...chatMessage, userId: userId },
              },
            },
          });

          break;
        case ReportType.Livestream:
          reportUser({
            variables: {
              reason: selectedReason ?? SupportReportReason.ReportReasonUnspecified,
              description: additionalDetails,
              context: {
                stream: { ...stream, userId: userId },
              },
            },
          });
          break;
      }
    } catch (error) {
      Alert.alert(
        "We couldn't send the report",
        'There was an error while submitting the report. Please try again.',
        [
          {
            text: 'Try again',
            onPress: () =>
              setFormState({
                additionalDetails: '',
                selectedReason: SupportReportReason.ReportReasonUnspecified,
                selectedReasonLabel: '',
                step: 'options-1',
              }),
          },
        ],
      );
    }
    setFormState({
      additionalDetails: '',
      selectedReason: SupportReportReason.ReportReasonUnspecified,
      selectedReasonLabel: '',
      step: 'submitted',
    });
  };

  const onReasonNodeSelect = (node: TreeNode) => {
    setReason(node.reason ?? SupportReportReason.ReportReasonUnspecified, node.label);
    if (node.subtree?.nodes && node.subtree?.nodes?.length > 0) {
      setReasonList(node.subtree);
    }
  };

  return (
    <View style={s.flex}>
      <PageLayout headerLeft={<ReportFlowHeaderLeft />}>
        <Gutter height={HEADER_BOTTOM_ROW_HEIGHT} />
        {step !== 'submitted' && (
          <ReportHeader
            reportType={reportType}
            userId={userId}
          />
        )}

        <Gutter height={24} />

        {(step === 'options-1' || step === 'options-2') && (
          <ReasonList
            selectedReasonLabel={selectedReasonLabel}
            visibleReasonList={visibleReasonList}
            onNodeSelect={onReasonNodeSelect}
          />
        )}
        {step === 'details' && (
          <Details
            additionalDetails={additionalDetails}
            selectedReason={selectedReasonLabel}
            setAdditionalDetails={setAdditionalDetails}
          />
        )}
        {step === 'submitted' && <Submitted />}
        <Gutter height={150} />
      </PageLayout>
      {step !== 'submitted' && (
        <View
          style={[
            s.bottomButtons,
            {
              paddingBottom: bottom || 16,
            },
          ]}
        >
          <HStack
            justifyContent="space-between"
            spacing={8}
          >
            {step !== 'options-1' && (
              <ButtonLarge
                analyticsActionName="REPORT_CANCEL"
                style={s.flex}
                onPress={handleCancel}
              >
                Cancel
              </ButtonLarge>
            )}
            <ButtonLarge
              analyticsActionName="REPORT_NEXT"
              backgroundColor="white"
              disabled={!canGoNext()}
              style={s.flex}
              textColor="darkMain"
              onPress={handleNext}
            >
              Next
            </ButtonLarge>
          </HStack>
        </View>
      )}
    </View>
  );
};

const ReportFlowHeaderLeft = () => {
  const navigation = useNavigation();
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={goBack}>
      <IconAssets.Close
        color={colors.white}
        height={20}
        width={20}
      />
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bottomButtons: {
    backgroundColor: colors.gray900,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopRightRadius: borderRadius.radiusMd,
    borderTopLeftRadius: borderRadius.radiusMd,
  },
});
