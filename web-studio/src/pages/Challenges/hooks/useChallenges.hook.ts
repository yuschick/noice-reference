import { Nullable } from '@noice-com/utils';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { CategoryChallenge, useCategoryChallenges } from '@common/challenge';

interface HookResult {
  isLoadingChallenges: boolean;
  challengeToEdit: Nullable<CategoryChallenge>;
  categoryChallenges: CategoryChallenge[];
  onDeleteChallenge: (id: string) => Promise<void>;
  onToggleChallengeDisabled: (id: string) => Promise<void>;
  onSaveChallenge: (description: string) => Promise<void>;
  onEditChallenge: (id: string) => void;
  onClearEditChallenge: () => void;
}

interface Props {
  selectedCategoryId: Nullable<string>;
}

export function useChallenges({ selectedCategoryId }: Props): HookResult {
  const [challengeIdToEdit, setChallengeIdToEdit] = useState<Nullable<string>>(null);

  const {
    categoryChallenges,
    isLoadingChallenges,
    onCreateChallenge,
    onDeleteChallenge,
    onUpdateChallenge,
  } = useCategoryChallenges(selectedCategoryId);

  const challengeToEdit = challengeIdToEdit
    ? categoryChallenges.find((c) => c.id === challengeIdToEdit) ?? null
    : null;

  const onDeleteChallengeFunc = async (challengeId: string) => {
    if (!selectedCategoryId) {
      return;
    }

    await onDeleteChallenge(challengeId);
    toast('Challenge deleted');
  };

  const onToggleChallengeDisabled = async (challengeId: string) => {
    if (!selectedCategoryId) {
      return;
    }

    const curChallenge = categoryChallenges.find(
      (challenge) => challenge.id === challengeId,
    );

    if (!curChallenge) {
      return;
    }

    await onUpdateChallenge(challengeId, {
      disabled: !curChallenge.disabled,
    });
    toast(`Challenge ${curChallenge.disabled ? 'enabled' : 'disabled'}`);
  };

  const onSaveChallenge = useCallback(
    async (description: string) => {
      if (!selectedCategoryId) {
        return;
      }

      if (!challengeToEdit) {
        await onCreateChallenge(description);
        toast(`Challenge created`);
        return;
      }

      await onUpdateChallenge(challengeToEdit.id, {
        description,
      });
      setChallengeIdToEdit(null);
      toast(`Challenge saved`);
    },
    [selectedCategoryId, challengeToEdit, onCreateChallenge, onUpdateChallenge],
  );

  const onClearEditChallenge = useCallback(() => setChallengeIdToEdit(null), []);

  return {
    isLoadingChallenges,
    challengeToEdit,
    categoryChallenges,
    onDeleteChallenge: onDeleteChallengeFunc,
    onToggleChallengeDisabled,
    onSaveChallenge,
    onEditChallenge: setChallengeIdToEdit,
    onClearEditChallenge,
  };
}
