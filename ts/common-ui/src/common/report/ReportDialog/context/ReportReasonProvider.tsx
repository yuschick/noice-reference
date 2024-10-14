import { Nullable, Optional } from '@noice-com/utils';
import { createContext, useCallback, useContext, useState } from 'react';

import {
  getChannelReportTree,
  getChatTree,
  getLivestreamTree,
  getUserReportTree,
  ReasonTree,
  TreeNode,
  UserRole,
} from '../../reasons';
import { ReportType, Report } from '../../types';

import { SupportReportReason } from '@common-gen';
import { WithChildren } from '@common-types';

interface Context {
  visibleReasonList: Nullable<ReasonTree<TreeNode[]>>;
  showBackButton: boolean;
  isReasonListVisible: boolean;
  isNextButtonDisabled: boolean;
  selectedReasonIndex: Optional<number>;
  report: Report;
  setDescription(description: string): void;
  onNextClick(): void;
  onBackClick(): void;
  onSubmit(): void;
  onReasonSelect(i: number): void;
}

const ReportReasonContext = createContext<Nullable<Context>>(null);

interface Props {
  reportType: ReportType;
  userRole: UserRole;
  onReportReasonSubmit: (report: Report) => void;
}

export function ReportReasonProvider({
  children,
  reportType,
  userRole,
  onReportReasonSubmit,
}: WithChildren<Props>) {
  const [reasonTree] = useState<ReasonTree<TreeNode[]>>(() => {
    if (reportType === ReportType.Livestream) {
      return getLivestreamTree(userRole);
    }

    if (reportType === ReportType.ChannelChat) {
      return getChatTree(userRole);
    }

    if (reportType === ReportType.Channel) {
      return getChannelReportTree(userRole);
    }

    return getUserReportTree(userRole);
  });
  const [visibleReasonList, setVisibleReasonList] = useState<ReasonTree<
    TreeNode[]
  > | null>(reasonTree);
  const [reasonListsHistory, setReasonListsHistory] = useState<ReasonTree<TreeNode[]>[]>(
    [],
  );
  const [selectedReasonIndexesHistory, setSelectedReasonIndexesHistory] = useState<
    number[]
  >([]);
  const [selectedReasonIndex, setSelectedReasonIndex] = useState<number>();
  const [description, setDescription] = useState<string>();
  const [report, setReport] = useState<Report>({
    reasonText: '',
    reason: SupportReportReason.ReportReasonUnspecified,
  });

  const onNextClick = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const selectedNode = visibleReasonList!.nodes[selectedReasonIndex!];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setSelectedReasonIndexesHistory((history) => [...history, selectedReasonIndex!]);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setReasonListsHistory((tree) => [...tree, visibleReasonList!]);

    if ('reason' in selectedNode) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setReport((report) => ({ ...report, reason: selectedNode.reason! }));
    }

    if ('subtree' in selectedNode) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setVisibleReasonList(selectedNode.subtree!);
      setSelectedReasonIndex(undefined);
      return;
    }

    // store last selected reason label to be shown as report reason for user
    setReport((report) => ({ ...report, reasonText: selectedNode.label }));
    setVisibleReasonList(null);
    return;
  }, [selectedReasonIndex, visibleReasonList]);

  const onBackClick = useCallback(() => {
    // restore previously selected reason list
    setVisibleReasonList(reasonListsHistory[reasonListsHistory.length - 1]);
    // restore previously selected reason index in the list
    setSelectedReasonIndex(
      selectedReasonIndexesHistory[selectedReasonIndexesHistory.length - 1],
    );

    // cleanup history records
    setSelectedReasonIndexesHistory((history) => {
      return history.slice(0, -1);
    });
    setReasonListsHistory((history) => {
      return history.slice(0, -1);
    });
  }, [reasonListsHistory, selectedReasonIndexesHistory]);

  const onSubmit = useCallback(() => {
    onReportReasonSubmit({
      ...report,
      description,
    });
  }, [description, onReportReasonSubmit, report]);

  return (
    <ReportReasonContext.Provider
      value={{
        onNextClick,
        onBackClick,
        showBackButton: selectedReasonIndexesHistory.length > 0,
        onSubmit,
        isReasonListVisible: !!visibleReasonList,
        isNextButtonDisabled: selectedReasonIndex === undefined,
        onReasonSelect: setSelectedReasonIndex,
        visibleReasonList,
        selectedReasonIndex,
        setDescription,
        report,
      }}
    >
      {children}
    </ReportReasonContext.Provider>
  );
}

export function useReportReason() {
  const context = useContext(ReportReasonContext);

  if (!context) {
    throw new Error('useReportReason must be used within a ReportReasonProvider');
  }

  return context;
}
