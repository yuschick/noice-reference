import { FontSizeSelector, SegmentedControl } from '@noice-com/common-ui';
import { useContext } from 'react';

import { WidgetSettings } from '../WidgetSettings';

import styles from './AudienceInsights.module.css';
import { AudienceInsightsSettingsContext } from './AudienceInsightsSettingsProvider';

export function AudienceInsightsSettings() {
  const context = useContext(AudienceInsightsSettingsContext);

  if (!context) {
    return null;
  }

  return (
    <WidgetSettings>
      <div className={styles.settingsTitle}>Audience Insights Settings</div>
      <SegmentedControl label="Display Count">
        <SegmentedControl.Button
          isSelected={context.countDisplayType === 'absolute'}
          onClick={() => context.setCountDisplayType('absolute')}
        >
          Absolute
        </SegmentedControl.Button>
        <SegmentedControl.Button
          isSelected={context.countDisplayType === 'percentage'}
          onClick={() => context.setCountDisplayType('percentage')}
        >
          Percentage
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
