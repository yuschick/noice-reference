import { gql } from '@apollo/client';
import { useBooleanFeatureFlag } from '@noice-com/common-ui';
import { ListChallengesResponse } from '@noice-com/schemas/challenge/challenge.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback } from 'react';

import { useChannelContext } from '@common/channel';
import {
  UseCategoryChallengeChallengeFragment,
  useCategoryChallengesQuery,
  useCreateChallengeMutation,
  useDeleteChallengeMutation,
  useUpdateChallengeMutation,
} from '@gen';

gql`
  fragment UseCategoryChallengeChallenge on GameLogicChallenge {
    id
    ...CategoryOverviewChallenge
  }

  query CategoryChallenges($gameId: ID!, $channelId: ID!) {
    listChallenges(gameId: $gameId, channelId: $channelId) {
      challenges {
        ...UseCategoryChallengeChallenge
      }
    }
  }

  mutation CreateChallenge($gameId: ID!, $channelId: ID!, $description: String!) {
    createChallenge(gameId: $gameId, channelId: $channelId, description: $description) {
      ...UseCategoryChallengeChallenge
    }
  }

  mutation UpdateChallenge(
    $gameId: ID!
    $challengeId: ID!
    $channelId: ID!
    $description: String!
    $disabled: Boolean
  ) {
    updateChallenge(
      body: {
        gameId: $gameId
        challengeId: $challengeId
        channelId: $channelId
        description: $description
        disabled: $disabled
      }
    ) {
      ...UseCategoryChallengeChallenge
    }
  }

  mutation DeleteChallenge($challengeId: ID!, $channelId: ID!) {
    deleteChallenge(challengeId: $challengeId, channelId: $channelId) {
      emptyTypeWorkaround
    }
  }
`;

interface UpdateData {
  description: string;
  disabled: boolean;
}

export type CategoryChallenge = UseCategoryChallengeChallengeFragment;

interface HookResult {
  isLoadingChallenges: boolean;
  categoryChallenges: CategoryChallenge[];
  onCreateChallenge: (description: string) => Promise<void>;
  onUpdateChallenge: (challengeId: string, data: Partial<UpdateData>) => Promise<void>;
  onDeleteChallenge: (id: string) => Promise<void>;
}

export function useCategoryChallenges(categoryId: Nullable<string>): HookResult {
  const { channelId } = useChannelContext();
  const [umcEnabled, loadingFeatureFlag] = useBooleanFeatureFlag(
    'universalMatchChallenges',
    false,
  );

  const { data, loading: isLoadingChallenges } = useCategoryChallengesQuery({
    variables: {
      // This is for typescript since doesn't like selectedCategoryId!
      gameId: categoryId ? categoryId : '',
      channelId,
    },
    skip: loadingFeatureFlag || !umcEnabled || !categoryId,
  });

  const [createChallenge] = useCreateChallengeMutation({
    update(cache, result) {
      const newChallenge = result?.data?.createChallenge;

      if (!newChallenge) {
        return;
      }

      const newChallengeFragment = cache.writeFragment({
        id: cache.identify({
          id: newChallenge.id,

          __typename: 'GameLogicChallenge',
        }),
        data: { id: newChallenge.id },
        fragment: gql`
          fragment NewChallenge on GameLogicChallenge {
            id
          }
        `,
      });

      cache.modify({
        fields: {
          listChallenges(existingChallenges = {}) {
            return {
              ...existingChallenges,
              challenges: [
                ...(existingChallenges.challenges ?? []),
                newChallengeFragment,
              ],
            };
          },
        },
      });
    },
  });
  const [deleteChallenge] = useDeleteChallengeMutation({
    update(cache, _result, { variables }) {
      cache.modify({
        fields: {
          listChallenges(
            existingChallenges: Partial<ListChallengesResponse>,
            { readField },
          ) {
            return {
              ...existingChallenges,
              challenges: (existingChallenges.challenges ?? []).filter(
                (c) => readField('id', c) !== variables?.challengeId,
              ),
            };
          },
        },
      });
    },
  });
  const [updateChallenge] = useUpdateChallengeMutation();

  const categoryChallenges = data?.listChallenges?.challenges ?? [];

  const onDeleteChallenge = async (challengeId: string) => {
    if (!categoryId) {
      return;
    }

    await deleteChallenge({
      variables: {
        challengeId,
        channelId,
      },
    });
  };

  const onUpdateChallenge = async (
    challengeId: string,
    updateData: Partial<UpdateData>,
  ) => {
    if (!categoryId) {
      return;
    }

    const curChallenge = categoryChallenges.find(
      (challenge) => challenge.id === challengeId,
    );

    if (!curChallenge) {
      return;
    }

    await updateChallenge({
      variables: {
        gameId: categoryId,
        challengeId,
        channelId,
        description: curChallenge.description,
        disabled: curChallenge.disabled,
        ...updateData,
      },
    });
  };

  const onCreateChallenge = useCallback(
    async (description: string) => {
      if (!categoryId) {
        return;
      }

      await createChallenge({
        variables: {
          gameId: categoryId,
          channelId,
          description,
        },
      });
    },
    [categoryId, channelId, createChallenge],
  );

  return {
    isLoadingChallenges,
    categoryChallenges,
    onDeleteChallenge,
    onCreateChallenge,
    onUpdateChallenge,
  };
}
