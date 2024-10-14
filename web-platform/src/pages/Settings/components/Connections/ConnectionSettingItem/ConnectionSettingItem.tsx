import { Button, Icon } from '@noice-com/common-ui';
import { CSSProperties } from 'react';

import { SettingsItem } from '../../SettingsGroup';
import { AccountConnection, DialogConnection } from '../types';

import styles from './ConnectionSettingItem.module.css';

interface Props {
  connection: AccountConnection;
  onClick(connection: DialogConnection): void;
}

export function ConnectionSettingItem({ connection, onClick }: Props) {
  const { label, icon, color, connected } = connection;

  return (
    <SettingsItem
      key={label}
      state={connected ? 'enabled' : 'disabled'}
    >
      <div
        className={styles.connectionWrapper}
        style={
          {
            '--connection-icon-color': color,
          } as CSSProperties
        }
      >
        {icon && (
          <Icon
            className={styles.icon}
            icon={icon}
          />
        )}
        <span>{label}</span>
      </div>

      <SettingsItem.Control>
        <Button
          size="sm"
          theme={connected ? 'dark' : 'light'}
          onClick={() => {
            onClick({
              account: label,
              action: connected ? 'disconnect' : 'connect',
            });
          }}
        >
          {connected ? 'Disconnect' : 'Connect'}
        </Button>
      </SettingsItem.Control>
    </SettingsItem>
  );
}
