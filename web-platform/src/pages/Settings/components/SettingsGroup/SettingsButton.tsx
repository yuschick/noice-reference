import { CoreAssets } from '@noice-com/assets-core';
import { Button, Icon } from '@noice-com/common-ui';
import { JSX } from 'react';

import styles from './SettingsGroup.module.css';
import { SettingsItem } from './SettingsItem';

interface Props {
  title: string;
  description: JSX.Element | string;
  onClick: () => void;
}

export function SettingsButton({ onClick, description }: Props) {
  return (
    <SettingsItem state="enabled">
      <div className={styles.settingsButtonHeadingWrapper}>
        <Icon icon={CoreAssets.Icons.Info} />

        <span>Not receiving notifications?</span>
      </div>
      <div></div>
      <section className={styles.settingsButtonContent}>
        <p>{description}</p>
        <Button
          size="xs"
          theme="dark"
          onClick={onClick}
        >
          Send a test notification
        </Button>
      </section>
    </SettingsItem>
  );
}
