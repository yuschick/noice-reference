import { useBooleanFeatureFlag } from '@noice-com/common-react-core';
import { useToggle } from '@noice-com/common-ui';
import { Navigate } from 'react-router';

import { ChallengeForm } from './ChallengeForm';
import styles from './Challenges.module.css';
import { ChallengesOverview } from './ChallengesOverview';
import { useChallenges, useSelectedCategory } from './hooks';

export function Challenges() {
  const [isFormOpen, _, openForm, closeForm] = useToggle(false);

  const [umcEnabled, loadingFeatureFlag] = useBooleanFeatureFlag(
    'universalMatchChallenges',
    false,
  );

  const { selectedCategory, categories, isLoadingCategories, onCategoryChange } =
    useSelectedCategory();
  const {
    isLoadingChallenges,
    challengeToEdit,
    categoryChallenges,
    onDeleteChallenge,
    onSaveChallenge,
    onToggleChallengeDisabled,
    onEditChallenge,
    onClearEditChallenge,
  } = useChallenges({ selectedCategoryId: selectedCategory?.id ?? null });

  if (loadingFeatureFlag) {
    return null;
  }

  // no permission to view this WIP view yet
  if (!umcEnabled) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const onOpenEditForm = (id: string) => {
    onEditChallenge(id);
    openForm();
  };

  const onCancelForm = () => {
    onClearEditChallenge();
    closeForm();
  };

  const onSubmitSaveChallenge = async (description: string) => {
    onSaveChallenge(description);
    closeForm();
  };

  return (
    <div className={styles.challengesRoot}>
      <div className={styles.challengesContent}>
        {isFormOpen && selectedCategory ? (
          <ChallengeForm
            categoryName={selectedCategory.name}
            initialValues={
              challengeToEdit ? { description: challengeToEdit.description } : undefined
            }
            onCancel={onCancelForm}
            onSave={onSubmitSaveChallenge}
          />
        ) : (
          <ChallengesOverview
            categories={categories}
            categoryChallenges={categoryChallenges}
            isLoading={isLoadingChallenges || isLoadingCategories}
            selectedCategory={selectedCategory}
            onAddNewChallengeCTA={openForm}
            onCategoryChange={onCategoryChange}
            onDeleteChallenge={onDeleteChallenge}
            onEditChallengeCTA={onOpenEditForm}
            onToggleChallengeDisabled={onToggleChallengeDisabled}
          />
        )}
      </div>
    </div>
  );
}
