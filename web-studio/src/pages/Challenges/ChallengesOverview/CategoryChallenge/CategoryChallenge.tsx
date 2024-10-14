import { gql } from '@apollo/client';
import { Button, useLoadingPromise } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './CategoryChallenge.module.css';

import { CategoryChallengeFragment } from '@gen';

gql`
  fragment CategoryChallenge on GameLogicChallenge {
    id
    description
    disabled
  }
`;

interface Props {
  challenge: CategoryChallengeFragment;
  onToggleDisabled: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export function CategoryChallenge({
  challenge,
  onDelete,
  onEdit,
  onToggleDisabled,
}: Props) {
  const [handleDelete, isDeleting] = useLoadingPromise(onDelete);
  const [handleToggle, isToggling] = useLoadingPromise(onToggleDisabled);

  return (
    <div
      className={classNames(styles.categoryChallengeRoot, {
        [styles.isDisabled]: challenge.disabled,
      })}
    >
      <span className={styles.categoryChallengeName}>
        {challenge.disabled && (
          <>
            <span className={styles.categoryChallengeDisabled}>Disabled</span>
            <br />
          </>
        )}
        {challenge.description}
      </span>

      <Button
        fit="content"
        isLoading={isToggling}
        level="secondary"
        size="xs"
        onClick={() => handleToggle(challenge.id)}
      >
        {challenge.disabled ? 'Enable' : 'Disable'}
      </Button>
      <Button
        fit="content"
        level="secondary"
        size="xs"
        onClick={() => onEdit(challenge.id)}
      >
        Edit
      </Button>
      <Button
        fit="content"
        isLoading={isDeleting}
        level="secondary"
        size="xs"
        onClick={() => handleDelete(challenge.id)}
      >
        Delete
      </Button>
    </div>
  );
}
