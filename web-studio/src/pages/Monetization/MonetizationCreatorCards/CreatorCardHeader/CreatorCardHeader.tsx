import { ButtonLink } from '@noice-com/common-ui';
import { FaChevronLeft } from 'react-icons/fa';

import { useCreatorCardLinks } from '../hooks';

import styles from './CreatorCardHeader.module.css';

interface Props {
  title: string;
  details?: string;
}

export const CreatorCardHeader = ({ title, details }: Props) => {
  const { toCreatorCardList } = useCreatorCardLinks();

  return (
    <header className={styles.header}>
      <ButtonLink
        fit="content"
        iconStart={FaChevronLeft}
        level="secondary"
        to={toCreatorCardList}
      >
        Back to list
      </ButtonLink>

      <div className={styles.titleWrapper}>
        {!!details && <span className={styles.details}>{details}</span>}

        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  );
};
