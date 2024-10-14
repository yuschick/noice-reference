import { gql } from '@apollo/client';

import { ButtonColumn } from './ButtonColumn/ButtonColumn';
import { ChallengeList } from './ChallengeList/ChallengeList';
import { Footer } from './Footer/Footer';
import styles from './UniversalChallenges.module.css';

gql`
  query UniversalChallengesRandomQueryForCodegenToPass {
    profileBatch(userIds: []) {
      profiles {
        userId
      }
    }
  }
`;

export function UniversalChallenges() {
  return (
    <div className={styles.universalChallengesContainer}>
      <ButtonColumn />
      <div className={styles.gameContainer}>
        <ChallengeList />
        <Footer />
      </div>
    </div>
  );
}
