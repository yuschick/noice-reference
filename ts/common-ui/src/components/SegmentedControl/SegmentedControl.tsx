import { Children, ReactNode, isValidElement } from 'react';

import styles from './SegmentedControl.module.css';
import { SegmentedControlButton } from './SegmentedControlButton';

interface Props {
  children: ReactNode[];
  displayValue?: string;
  label: string;
}

export function SegmentedControl({ children, label, displayValue }: Props) {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === SegmentedControlButton) {
      return;
    }

    throw new Error(`Segmented Control: Invalid child type: ${child.type}`);
  });
  return (
    <section className={styles.segmentedControlWrapper}>
      <div className={styles.segmentedLabelValueWrapper}>
        <span>{label}</span>
        {!!displayValue && <span className={styles.controlValue}>{displayValue}</span>}
      </div>

      <ul
        aria-label={label}
        className={styles.controlList}
      >
        {children.map((child, index) => (
          <li
            className={styles.controlListItem}
            key={index}
          >
            {child}
          </li>
        ))}
      </ul>
    </section>
  );
}

SegmentedControl.Button = SegmentedControlButton;
