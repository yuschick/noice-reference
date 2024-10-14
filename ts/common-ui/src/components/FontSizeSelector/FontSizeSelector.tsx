import { SegmentedControl } from '../SegmentedControl';
import { VisuallyHidden } from '../VisuallyHidden';

import styles from './FontSizeSelector.module.css';

import { FontSize, fontSizeOptions } from '@common-types';

interface Props {
  defaultFontSize?: FontSize;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  title: string;
  withDisplayValue?: boolean;
  withLabel?: boolean;
}

export function FontSizeSelector({
  defaultFontSize = 'medium',
  fontSize,
  setFontSize,
  title,
  withDisplayValue,
  withLabel,
}: Props) {
  return (
    <SegmentedControl
      displayValue={
        withDisplayValue
          ? fontSize === defaultFontSize
            ? `${fontSize} (default)`
            : fontSize
          : undefined
      }
      label={withLabel ? title : ''}
    >
      {fontSizeOptions.map((option) => (
        <SegmentedControl.Button
          isSelected={fontSize === option}
          key={option}
          onClick={() => setFontSize(option)}
        >
          <VisuallyHidden>{option}</VisuallyHidden>

          <span
            aria-hidden="true"
            className={styles[option]}
          >
            Aa
          </span>
        </SegmentedControl.Button>
      ))}
    </SegmentedControl>
  );
}
