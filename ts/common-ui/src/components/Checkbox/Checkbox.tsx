import classNames from 'classnames';
import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';

import { InteractiveInputDescription } from '../InteractiveInputDescription';
import { InteractiveInputLabel } from '../InteractiveInputLabel';

import styles from './Checkbox.module.css';

interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'color' | 'name' | 'style' | 'type'
  > {
  direction?: 'ltr' | 'rtl';
  description?: string;
  label: string | ReactNode;
  labelType?: 'hidden' | 'visible';
  theme?: 'dark' | 'light';
  name: string;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  {
    description,
    direction = 'ltr',
    disabled,
    label,
    labelType = 'visible',
    name,
    theme = 'light',
    ...htmlAttributes
  },
  externalRef,
) {
  const descriptionId = useId();

  const showLabel = labelType !== 'hidden';
  const showDescription = !!description && showLabel;

  return (
    <div
      className={classNames(styles.checkboxRoot, styles[theme], {
        [styles.disabled]: disabled,
        [styles.rtl]: direction === 'rtl',
      })}
    >
      <label className={styles.checkboxWrapper}>
        <input
          {...htmlAttributes}
          aria-describedby={showDescription ? descriptionId : undefined}
          className={styles.checkbox}
          disabled={disabled}
          name={name}
          ref={externalRef}
          type="checkbox"
        />

        <InteractiveInputLabel
          isDisabled={disabled}
          label={label}
          showLabel={showLabel}
        />
      </label>

      {showDescription && (
        <div className={styles.descriptionWrapper}>
          <InteractiveInputDescription
            description={description}
            id={descriptionId}
          />
        </div>
      )}
    </div>
  );
});
