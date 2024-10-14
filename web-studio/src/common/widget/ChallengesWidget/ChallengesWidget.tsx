import { LoadingSpinner } from '@noice-com/common-ui';

import { WidgetId, WidgetOfflineCheck } from '../types';

import styles from './ChallengesWidget.module.css';
import { CreateChallengeSession } from './CreateChallengeSession';
import { useChallengeSession } from './hooks';
import { PickingChallenges } from './PickingChallenges';
import { SetupChallenges } from './SetupChallenges';

import { ChallengesessionChallengeSessionPhase } from '@gen';

const Widget = () => {
  const {
    isLoadingData,
    hasChallengeSession,
    phase,
    submissionTimeMin,
    challenges,
    categoryId,
    onUpdateChallengeSession,
    onSubmissionStart,
    onSubmissionCancel,
    onCopyOldChallengeSessionAsDraft,
    onCreateChallengeSessionDraft,
  } = useChallengeSession();

  const createNewPhase =
    phase === ChallengesessionChallengeSessionPhase.PhaseUnspecified ||
    phase === ChallengesessionChallengeSessionPhase.PhaseCancelled;

  const showSetupPhase = phase === ChallengesessionChallengeSessionPhase.PhaseDraft;
  const showPickPhase = phase === ChallengesessionChallengeSessionPhase.PhaseSubmission;

  return (
    <div className={styles.challengesWidgetRoot}>
      {isLoadingData ? (
        <div className={styles.challengesLoadingWrapper}>
          <LoadingSpinner size="sm" />
        </div>
      ) : createNewPhase ? (
        <CreateChallengeSession
          isOldSessionAvailable={hasChallengeSession}
          onCopyOldAsDraft={onCopyOldChallengeSessionAsDraft}
          onNewDraft={onCreateChallengeSessionDraft}
        />
      ) : showSetupPhase ? (
        <SetupChallenges
          categoryId={categoryId}
          sessionChallenges={challenges}
          submissionTimeMin={submissionTimeMin}
          onSubmissionStart={onSubmissionStart}
          onUpdateChallengeSession={onUpdateChallengeSession}
        />
      ) : showPickPhase ? (
        <PickingChallenges
          sessionChallenges={challenges}
          onSubmissionCancel={onSubmissionCancel}
        />
      ) : null}
    </div>
  );
};

export default {
  offline: ({ streamId }: WidgetOfflineCheck) => {
    return !streamId
      ? {
          title: 'Challenges offline',
          description: 'Start streaming to add challenges for your audience!',
        }
      : null;
  },
  id: WidgetId.Challenges,
  Component: Widget,
} as const;
