import classNames from 'classnames';
import { useContext } from 'react';

import { AudienceInsightsSettingsContext } from '../AudienceInsightsSettingsProvider';
import { InsightItem } from '../types';

import styles from './InsightsItem.module.css';
import { ValueBar } from './ValueBar';

interface Props {
  items: [InsightItem, InsightItem];
}

export function InsightsItem({ items }: Props) {
  const context = useContext(AudienceInsightsSettingsContext);

  if (!context) {
    return null;
  }

  const { fontSize } = context;
  const [item1, item2] = items;

  return (
    <div className={classNames(styles.insightsItem, styles[fontSize])}>
      <span className={styles.labelOne}>{item1.label}</span>
      <ValueBar values={[item1.value, item2.value]} />
      <span className={styles.labelTwo}>{item2.label}</span>
    </div>
  );
}
