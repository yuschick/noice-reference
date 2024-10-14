import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { useChannelContext } from '@common/channel';
import { useStreamContext } from '@common/stream';
import {
  ChallengeFragment,
  ChallengesessionChallenge,
  ChallengesessionChallengeSessionPhase,
  useChallengeSessionQuery,
  useCreateChallengeSessionMutation,
  useProgressChallengeSessionMutation,
  useUpdateChallengeSessionMutation,
} from '@gen';

gql`
  fragment Challenge on ChallengesessionChallenge {
    id
    description
    state
  }

  fragment ChallengeSessionChallengeStatus on ChallengesessionChallenge {
    id
    ...PickingChallengesChallenge
  }

  fragment ChallengeSession on ChallengesessionChallengeSession {
    id
    submissionWindowLength
    phase
    challenges {
      ...Challenge
    }
  }

  query ChallengeSession($channelId: ID!, $streamId: ID!) {
    getChallengeSession(streamId: $streamId) {
      ...ChallengeSession
    }

    channel(id: $channelId) {
      id
      streamedGames {
        id
      }
    }
  }

  mutation CreateChallengeSession(
    $gameId: ID!
    $streamId: ID!
    $challenges: [ChallengesessionChallengeInput!]!
    $submissionWindowLength: Int!
  ) {
    createChallengeSession(
      gameId: $gameId
      streamId: $streamId
      challenges: $challenges
      submissionWindowLength: $submissionWindowLength
    ) {
      ...ChallengeSession
    }
  }

  mutation UpdateChallengeSession(
    $gameId: ID!
    $streamId: ID!
    $challenges: [ChallengesessionChallengeInput!]!
    $submissionWindowLength: Int!
  ) {
    updateChallengeSession(
      body: {
        streamId: $streamId
        gameId: $gameId
        challenges: $challenges
        submissionWindowLength: $submissionWindowLength
      }
    ) {
      ...ChallengeSession
    }
  }

  mutation ProgressChallengeSession(
    $streamId: ID!
    $phase: ChallengesessionChallengeSessionPhase!
  ) {
    progressChallengeSession(streamId: $streamId, phase: $phase) {
      ...ChallengeSession
    }
  }
`;

export type UpdateChallengeSessionParams = Partial<{
  challenges: ChallengesessionChallenge[];
  categoryId: string;
  submissionTimeMin: number;
}>;

interface HookResult {
  isLoadingData: boolean;
  hasChallengeSession: boolean;
  phase: ChallengesessionChallengeSessionPhase;
  submissionTimeMin: number;
  categoryId: Nullable<string>;
  challenges: ChallengeFragment[];
  onCreateChallengeSessionDraft: () => Promise<void>;
  onCopyOldChallengeSessionAsDraft: () => Promise<void>;
  onUpdateChallengeSession: (params: UpdateChallengeSessionParams) => Promise<void>;
  onSubmissionStart: () => Promise<void>;
  onSubmissionCancel: () => Promise<void>;
}

// 5 minute default pick window
const DEFAULT_SUBMISSION_TIME_MIN = 5;

export function useChallengeSession(): HookResult {
  const { channelId } = useChannelContext();
  const { streamId } = useStreamContext();

  const { data, loading } = useChallengeSessionQuery({
    variables: { streamId: streamId ? streamId : '', channelId },
    skip: !streamId,
  });

  const challengeSession = data?.getChallengeSession;
  const phase =
    challengeSession?.phase ?? ChallengesessionChallengeSessionPhase.PhaseUnspecified;
  const currentChallengeSessionId = challengeSession?.id;
  const currentChallenges = challengeSession?.challenges.map((c) => c) ?? [];
  const categoryId = data?.channel?.streamedGames?.[0].id ?? null;
  const currentSubmissionTimeMin = challengeSession?.submissionWindowLength
    ? challengeSession.submissionWindowLength / 60000
    : DEFAULT_SUBMISSION_TIME_MIN;

  const [createChallengeSession] = useCreateChallengeSessionMutation({
    update(cache, result) {
      const newChallengeSession = result?.data?.createChallengeSession;

      if (!newChallengeSession) {
        return;
      }

      cache.modify({
        fields: {
          getChallengeSession() {
            const newChallengeFragment = cache.writeFragment({
              id: cache.identify({
                id: newChallengeSession.id,
                __typename: 'ChallengesessionChallengeSession',
              }),
              data: { id: newChallengeSession.id },
              fragment: gql`
                fragment NewChallengeSession on ChallengesessionChallengeSession {
                  id
                }
              `,
            });

            return newChallengeFragment;
          },
        },
      });
    },
  });

  const [updateChallengeSession] = useUpdateChallengeSessionMutation({
    update(cache, result) {
      const newChallengeSession = result?.data?.updateChallengeSession;

      if (!newChallengeSession) {
        return;
      }

      cache.modify({
        fields: {
          getChallengeSession() {
            const newChallengeFragment = cache.writeFragment({
              id: cache.identify({
                id: newChallengeSession.id,
                __typename: 'ChallengesessionChallengeSession',
              }),
              data: { id: newChallengeSession.id },
              fragment: gql`
                fragment NewChallengeSession on ChallengesessionChallengeSession {
                  id
                }
              `,
            });

            return newChallengeFragment;
          },
        },
      });
    },
  });

  const [progressChallengeSession] = useProgressChallengeSessionMutation({
    update(cache, result) {
      const newChallengeSession = result?.data?.progressChallengeSession;

      if (!newChallengeSession) {
        return;
      }

      cache.modify({
        fields: {
          getChallengeSession() {
            const newChallengeFragment = cache.writeFragment({
              id: cache.identify({
                id: newChallengeSession.id,

                __typename: 'ChallengesessionChallengeSession',
              }),
              data: { id: newChallengeSession.id },
              fragment: gql`
                fragment NewChallengeSession on ChallengesessionChallengeSession {
                  id
                }
              `,
            });

            return newChallengeFragment;
          },
        },
      });
    },
  });

  const onUpdateChallengeSession = async (params: UpdateChallengeSessionParams) => {
    const {
      challenges = currentChallenges,
      submissionTimeMin = currentSubmissionTimeMin,
    } = params;
    // Convert minutes to milliseconds
    const submissionWindowLength = submissionTimeMin * 60000;

    if (!categoryId || !streamId) {
      return;
    }

    if (!currentChallengeSessionId) {
      throw new Error("Can't update a challenge session that doesn't exist");
    }

    await updateChallengeSession({
      variables: {
        gameId: categoryId,
        streamId: streamId,
        challenges,
        submissionWindowLength,
      },
    });
  };

  const onSubmissionStart = async () => {
    if (!streamId) {
      return;
    }

    await progressChallengeSession({
      variables: {
        streamId,
        phase: ChallengesessionChallengeSessionPhase.PhaseSubmission,
      },
    });
  };

  const onSubmissionCancel = async () => {
    if (!streamId || !categoryId) {
      return;
    }

    await progressChallengeSession({
      variables: {
        streamId,
        phase: ChallengesessionChallengeSessionPhase.PhaseCancelled,
      },
    });
  };

  const onCreateChallengeSessionDraft = async () => {
    if (!categoryId || !streamId) {
      return;
    }

    await createChallengeSession({
      variables: {
        gameId: categoryId,
        streamId: streamId,
        challenges: [],
        submissionWindowLength: DEFAULT_SUBMISSION_TIME_MIN * 60000,
      },
    });
  };

  const onCopyOldChallengeSessionAsDraft = async () => {
    if (!categoryId || !streamId) {
      return;
    }

    await createChallengeSession({
      variables: {
        gameId: categoryId,
        streamId: streamId,
        challenges: currentChallenges,
        submissionWindowLength: currentSubmissionTimeMin * 60000,
      },
    });
  };

  return {
    isLoadingData: loading,
    hasChallengeSession: !!currentChallengeSessionId,
    phase,
    submissionTimeMin: currentSubmissionTimeMin,
    categoryId,
    challenges: currentChallenges,
    onUpdateChallengeSession,
    onSubmissionStart,
    onSubmissionCancel,
    onCreateChallengeSessionDraft,
    onCopyOldChallengeSessionAsDraft,
  };
}
