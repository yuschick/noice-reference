import { SettingsMenu } from '../SettingsMenu/SettingsMenu';

import styles from './SettingsSidebar.module.css';

export function SettingsSidebar() {
  return (
    <aside className={styles.settingsSidebar}>
      <h1 className={styles.settingsTitle}>User Settings</h1>

      <SettingsMenu />
    </aside>
  );
}
