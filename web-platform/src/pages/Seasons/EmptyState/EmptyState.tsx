import { CoreAssets } from '@noice-com/assets-core';
import { ButtonLink, Icon } from '@noice-com/common-ui';

import styles from './EmptyState.module.css';

import { Routes } from '@common/route';

interface Props {
  text: string;
}

export function EmptyState({ text }: Props) {
  return (
    <div className={styles.wrapper}>
      <Icon
        className={styles.checkMark}
        icon={CoreAssets.Icons.Seasons}
        size={64}
      />

      <span className={styles.text}>{text}</span>

      <ButtonLink
        fit="content"
        level="secondary"
        to={Routes.Home}
      >
        Browse streams
      </ButtonLink>
    </div>
  );
}
