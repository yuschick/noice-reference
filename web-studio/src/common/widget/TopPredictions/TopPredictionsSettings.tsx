import { FontSize, FontSizeSelector, Switch } from '@noice-com/common-ui';

import { WidgetSettings } from '../WidgetSettings';

import styles from './TopPredictions.module.css';

interface Props {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  setShowDescriptions: (show: boolean) => void;
  showDescriptions: boolean;
}

export function TopPredictionsSettings({
  fontSize,
  setFontSize,
  setShowDescriptions,
  showDescriptions,
}: Props) {
  return (
    <WidgetSettings>
      <div className={styles.settingsTitle}>Top Predictions Settings</div>

      <section className={styles.settingsGroup}>
        <Switch
          checked={showDescriptions}
          direction="rtl"
          label="Show descriptions"
          onChange={() => setShowDescriptions(!showDescriptions)}
        />
      </section>

      <FontSizeSelector
        fontSize={fontSize}
        setFontSize={setFontSize}
        title="Font size"
        withDisplayValue
        withLabel
      />
    </WidgetSettings>
  );
}
