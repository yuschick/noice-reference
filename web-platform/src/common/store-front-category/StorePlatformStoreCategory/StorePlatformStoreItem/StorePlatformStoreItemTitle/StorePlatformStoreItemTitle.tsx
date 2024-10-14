import { Nullable } from '@noice-com/utils';

import { PlatformStoreItemType } from '../common';

import styles from './StorePlatformStoreItemTitle.module.css';

interface Props {
  type: PlatformStoreItemType;
}

export const StorePlatformStoreItemTitle = ({ type }: Props) => {
  let Content: Nullable<React.JSX.Element | string> = null;

  switch (type) {
    case 'hard-currency':
      Content = 'Noice credits';
      break;
    case 'reshuffle-token':
      Content = 'Reshuffle tokens';
      break;
    case 'standard-card-bundle':
      Content = (
        <>
          <div className={styles.secondaryTitle}>Standard</div>
          <div>card bundles</div>
        </>
      );
      break;
  }

  return <div className={styles.title}>{Content}</div>;
};
