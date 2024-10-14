import { CoreAssets } from '@noice-com/assets-core';
import { FontSizeSelector, SegmentedControl, Switch } from '@noice-com/common-ui';
import { useContext } from 'react';

import { WidgetSettings } from '../WidgetSettings';

import styles from './ActivityFeed.module.css';
import { ActivityFeedSettingsContext } from './ActivityFeedSettingsProvider';

export function ActivityFeedSettings() {
  const context = useContext(ActivityFeedSettingsContext);

  if (!context) {
    return null;
  }

  return (
    <WidgetSettings>
      <div className={styles.settingsTitle}>Activity Feed Settings</div>

      <div className={styles.groupWrapper}>
        <div className={styles.settingsGroupTitle}>User information</div>
        <section className={styles.settingsGroup}>
          <Switch
            checked={context.showAvatars}
            direction="rtl"
            label="Show profile images"
            onChange={() => context.setShowAvatars(!context.showAvatars)}
          />
          <Switch
            checked={context.showUserBadges}
            direction="rtl"
            label="Show user badges"
            onChange={() => context.setShowUserBadges(!context.showUserBadges)}
          />
        </section>
      </div>
      <SegmentedControl label="Timestamp">
        <SegmentedControl.Button
          isSelected={context.timestampFormat === 'relative'}
          onClick={() => context.setTimestampFormat('relative')}
        >
          Relative (30s ago)
        </SegmentedControl.Button>
        <SegmentedControl.Button
          isSelected={context.timestampFormat === 'absolute'}
          onClick={() => context.setTimestampFormat('absolute')}
        >
          Absolute (15:38)
        </SegmentedControl.Button>
      </SegmentedControl>

      <SegmentedControl label="Feed Direction">
        <SegmentedControl.Button
          iconStart={CoreAssets.Icons.ArrowUp}
          isSelected={context.direction === 'top'}
          onClick={() => context.setDirection('top')}
        >
          Latest top
        </SegmentedControl.Button>
        <SegmentedControl.Button
          iconStart={CoreAssets.Icons.ArrowDown}
          isSelected={context.direction === 'bottom'}
          onClick={() => context.setDirection('bottom')}
        >
          Latest bottom
        </SegmentedControl.Button>
      </SegmentedControl>
      <FontSizeSelector
        defaultFontSize="small"
        fontSize={context.fontSize}
        setFontSize={context.setFontSize}
        title="Font Size"
        withDisplayValue
        withLabel
      />
    </WidgetSettings>
  );
}
