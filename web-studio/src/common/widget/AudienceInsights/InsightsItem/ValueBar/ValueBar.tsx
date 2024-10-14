import { useContainerSize } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useContext, useRef } from 'react';

import { AudienceInsightsSettingsContext } from '../../AudienceInsightsSettingsProvider';
import { InsightItem } from '../../types';

import styles from './ValueBar.module.css';

interface Props {
  values: [InsightItem['value'], InsightItem['value']];
}

export function ValueBar({ values }: Props) {
  const context = useContext(AudienceInsightsSettingsContext);

  const valueBarOneRef = useRef<HTMLDivElement>(null);
  const valueBarTwoRef = useRef<HTMLDivElement>(null);
  const { inlineSize: valueBarOneSize } = useContainerSize(valueBarOneRef);
  const { inlineSize: valueBarTwoSize } = useContainerSize(valueBarTwoRef);

  const valueOneRef = useRef<HTMLSpanElement>(null);
  const valueTwoRef = useRef<HTMLSpanElement>(null);
  const { inlineSize: valueOneSize } = useContainerSize(valueOneRef);
  const { inlineSize: valueTwoSize } = useContainerSize(valueTwoRef);

  const value1 = values[0] ?? 1;
  const value2 = values[1] ?? 1;

  const popOutValueOne =
    valueBarOneSize &&
    typeof valueOneSize === 'number' &&
    valueOneSize >= valueBarOneSize - 16;
  const popOutValueTwo =
    valueBarTwoSize &&
    typeof valueTwoSize === 'number' &&
    valueTwoSize >= valueBarTwoSize - 16;

  if (!context) {
    return null;
  }

  const total = values[0] + values[1];

  const { fontSize } = context;
  const valueOnePercent = `${Math.round((values[0] / total) * 100) || 0}%`;
  const valueTwoPercent = `${Math.round((values[1] / total) * 100) || 0}%`;
  const valueOneDisplay =
    context.countDisplayType === 'percentage' ? valueOnePercent : value1;
  const valueTwoDisplay =
    context.countDisplayType === 'percentage' ? valueTwoPercent : value2;

  return (
    <div className={classNames(styles.valueBarsWrapper, styles[fontSize])}>
      <span className={styles.headerLabel}>{valueOneDisplay}</span>
      <span className={styles.headerLabel}>{valueTwoDisplay}</span>

      <div
        className={styles.valueBar}
        ref={valueBarOneRef}
        style={{ inlineSize: valueOnePercent }}
      >
        <span
          className={classNames(styles.value, {
            [styles.popOutOne]: popOutValueOne,
          })}
          ref={valueOneRef}
        >
          {valueOneDisplay}
        </span>
      </div>

      <div
        className={styles.valueBar}
        ref={valueBarTwoRef}
        style={{ inlineSize: valueTwoPercent }}
      >
        <span
          className={classNames(styles.value, {
            [styles.popOutTwo]: popOutValueTwo,
          })}
          ref={valueTwoRef}
        >
          {valueTwoDisplay}
        </span>
      </div>
    </div>
  );
}
