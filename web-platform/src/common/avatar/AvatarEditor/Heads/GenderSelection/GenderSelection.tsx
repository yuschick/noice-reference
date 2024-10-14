import { Button } from '@noice-com/common-ui';
import { Gender } from '@noice-com/schemas/avatar/avatar.pb';

import styles from './GenderSelection.module.css';

interface Props {
  selectedGender: Gender;
  onSelectedGender(gender: Gender): void;
}

export function GenderSelection({ selectedGender, onSelectedGender }: Props) {
  return (
    <div className={styles.genderSelectionWrapper}>
      <div>
        <Button
          level={selectedGender === Gender.GENDER_MALE ? 'primary' : 'secondary'}
          onClick={() => onSelectedGender(Gender.GENDER_MALE)}
        >
          Masculine
        </Button>
      </div>
      <div>
        <Button
          level={selectedGender === Gender.GENDER_FEMALE ? 'primary' : 'secondary'}
          onClick={() => onSelectedGender(Gender.GENDER_FEMALE)}
        >
          Feminine
        </Button>
      </div>
    </div>
  );
}
