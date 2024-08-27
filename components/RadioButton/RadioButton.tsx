import classNames from 'classnames';
import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';

import { InteractiveInputDescription } from '../InteractiveInputDescription';
import { InteractiveInputLabel } from '../InteractiveInputLabel';

import styles from './RadioButton.module.css';

interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'color' | 'name' | 'style' | 'type'
  > {
  description?: string;
  direction?: 'ltr' | 'rtl';
  label: string | ReactNode;
  labelType?: 'hidden' | 'visible';
  name: string;
  theme?: 'dark' | 'light';
}

export const RadioButton = forwardRef<HTMLInputElement, Props>(function RadioButton(
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
      className={classNames(styles.radioButtonRoot, styles[theme], {
        [styles.disabled]: disabled,
        [styles.rtl]: direction === 'rtl',
      })}
    >
      <label className={styles.wrapper}>
        <div className={styles.radioButtonWrapper}>
          <input
            {...htmlAttributes}
            aria-describedby={showDescription ? descriptionId : undefined}
            className={styles.radioButton}
            disabled={disabled}
            name={name}
            ref={externalRef}
            type="radio"
          />
        </div>

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
