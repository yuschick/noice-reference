import { gql } from '@apollo/client';
import { Anchor, Button, NoiceSupportLinks, Select } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { CategoryChallenge } from './CategoryChallenge';
import styles from './ChallengesOverview.module.css';

import { PageHeading } from '@common/layout';
import {
  CategoryOverviewChallengeFragment,
  ChallengesOverviewCategoryFragment,
} from '@gen';

gql`
  fragment CategoryOverviewChallenge on GameLogicChallenge {
    id
    ...CategoryChallenge
  }

  fragment ChallengesOverviewCategory on GameGame {
    id
    name
  }
`;

interface Props {
  isLoading: boolean;
  selectedCategory: Nullable<ChallengesOverviewCategoryFragment>;
  categories: ChallengesOverviewCategoryFragment[];
  categoryChallenges: CategoryOverviewChallengeFragment[];
  onAddNewChallengeCTA: () => void;
  onCategoryChange: (categoryId: string) => void;
  onDeleteChallenge: (id: string) => Promise<void>;
  onToggleChallengeDisabled: (id: string) => Promise<void>;
  onEditChallengeCTA: (id: string) => void;
}

export function ChallengesOverview({
  isLoading,
  selectedCategory,
  categories,
  categoryChallenges,
  onCategoryChange,
  onDeleteChallenge,
  onToggleChallengeDisabled,
  onEditChallengeCTA,
  onAddNewChallengeCTA,
}: Props) {
  const challengesAmount = categoryChallenges.length;

  return (
    <>
      <PageHeading
        description={
          <>
            Creators and mods can run challenges during live streams when Noice
            predictions are not enabled. Players can participate and predict the outcome
            of challenges and win channel currency.
            <br />
            <br />
            All challenges must follow our{' '}
            <Anchor href={NoiceSupportLinks.TermsOfService}>Terms of Service</Anchor>.
          </>
        }
        title="Challenges"
      />

      <div>
        <h2 className={styles.challengesSectionTitle}>Manage Challenges</h2>
        <p className={styles.challengesSectionDescription}>
          Save and edit your challenges. These challenges are available for use during
          live streams.
        </p>

        <div className={styles.challengesLayoutBox}>
          <div>
            <h3 className={styles.challengesLayoutBoxTitle}>Select stream category</h3>
            <p className={styles.challengesLayoutBoxDescription}>
              Challenges shown below will be available when you stream the selected
              category
            </p>
            <Select
              color="gray"
              isDisabled={isLoading}
              label="Select stream category"
              labelType="hidden"
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
                type: 'option',
              }))}
              value={selectedCategory?.id}
              onChange={(event) => onCategoryChange(event.target.value)}
            />
          </div>

          <div className={styles.challengesLayoutBoxDivider} />

          {isLoading ? (
            <div className={styles.challengesListLoading} />
          ) : (
            <div className={styles.challengesListHeaderWrapper}>
              <div className={styles.challengeListHeaderTitleWrapper}>
                <h4 className={styles.challengeListHeaderTitle}>
                  <strong className={styles.challengeListHeaderTitleStrong}>
                    {challengesAmount}
                  </strong>{' '}
                  challenges saved for{' '}
                  <strong className={styles.challengeListHeaderTitleStrong}>
                    {selectedCategory?.name}
                  </strong>
                </h4>
                <p className={styles.challengesListHeaderDescription}>
                  Max 99 challenges per category
                </p>
              </div>

              <Button
                fit="content"
                size="sm"
                onClick={onAddNewChallengeCTA}
              >
                Add new challenge
              </Button>
            </div>
          )}

          <div className={styles.challengesList}>
            {categoryChallenges.map((challenge) => (
              <CategoryChallenge
                challenge={challenge}
                key={challenge.id}
                onDelete={onDeleteChallenge}
                onEdit={onEditChallengeCTA}
                onToggleDisabled={onToggleChallengeDisabled}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
