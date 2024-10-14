import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './SearchResultMessage.module.css';

interface Props {
  title: string;
  subtitle: string;
  icon?: SvgrComponent;
}

export const SearchResultMessage = ({ title, subtitle, icon }: Props) => {
  return (
    <section className={styles.wrapper}>
      <div className={classNames(styles.resultsContainer, styles.noResults)}>
        <Icon
          icon={icon ?? CoreAssets.Icons.Search}
          size={48}
        />
        <div>
          <h1 className={classNames(styles.title, styles.primaryText)}>{title}</h1>
          <div className={styles.secondaryText}>{subtitle}</div>
        </div>
      </div>
    </section>
  );
};
