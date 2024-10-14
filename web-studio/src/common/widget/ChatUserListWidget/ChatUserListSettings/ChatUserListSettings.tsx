import { Switch } from '@noice-com/common-ui';

import { WidgetSettings } from '../../WidgetSettings';
import { useChatUserListSettings } from '../context';

import styles from './ChatUserListSettings.module.css';

export function ChatUserListSettings() {
  const { showUserBadges, setShowUserBadges } = useChatUserListSettings();

  return (
    <WidgetSettings>
      <div className={styles.settingsTitle}>User List Settings</div>

      <div className={styles.groupWrapper}>
        <div className={styles.settingsGroupTitle}>User information</div>
        <section className={styles.settingsGroup}>
          <Switch
            checked={showUserBadges}
            direction="rtl"
            label="Show user badges"
            onChange={() => setShowUserBadges(!showUserBadges)}
          />
        </section>
      </div>
    </WidgetSettings>
  );
}
