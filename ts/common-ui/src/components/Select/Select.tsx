import classNames from 'classnames';
import { SelectHTMLAttributes, forwardRef, useEffect, useId, useRef } from 'react';

import { VisuallyHidden } from '../VisuallyHidden';

import styles from './Select.module.css';

import { useMergeRefs } from '@common-hooks';

export const selectColors = ['blue', 'gray', 'light'] as const;
export const selectSizes = ['sm', 'md', 'lg'] as const;

interface Option {
  type: 'option';
  value: string;
  label: string;
}

interface Divider {
  type: 'divider';
}

export type SelectOption = Option | Divider;

export type BaseSelectProps = {
  errorMsg?: string;
  description?: string;
  isDisabled?: boolean;
  label: string;
  labelType?: 'fixed' | 'hidden';
  options: SelectOption[];
  selectSize?: (typeof selectSizes)[number];
  theme?: (typeof selectColors)[number];
};

type SelectHTMLProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'className'
  | 'id'
  | 'placeholder'
  | 'style'
  | 'disabled'
>;

type Props = SelectHTMLProps & BaseSelectProps;

export const Select = forwardRef<HTMLSelectElement, Props>(function InputField(
  {
    errorMsg,
    description,
    isDisabled,
    label,
    labelType = 'fixed',
    options,
    selectSize: selectSize = 'md',
    theme = 'light',
    ...htmlAttributes
  },
  externalRef,
) {
  const internalRef = useRef<HTMLSelectElement>(null);
  const ref = useMergeRefs([internalRef, externalRef]);

  const errorMsgId = useId();
  const hintId = useId();
  const selectId = useId();
  const hasHiddenLabel = labelType === 'hidden';

  useEffect(() => {
    const select = internalRef.current;

    if (!errorMsg || !select) {
      return;
    }

    /**
     * Whenever a field has an error, we want to immediately focus it to describe the error and give a chance to fix it.
     * In the case of a form that may have multiple errors, we focus the first field with an error.
     */
    const firstInputWithError = document.querySelector<HTMLSelectElement>(
      'select[aria-invalid="true"]:first-of-type',
    );

    if (select === firstInputWithError) {
      // @ts-ignore
      select.focus({ focusVisible: true });
    }
  }, [errorMsg]);

  return (
    <div
      className={classNames(styles.selectHintWrapper, styles[selectSize], styles[theme])}
    >
      <div className={styles.selectWrapper}>
        <label htmlFor={selectId}>
          {hasHiddenLabel ? (
            <VisuallyHidden>{label}</VisuallyHidden>
          ) : (
            <div className={styles.fixedLabelWrapper}>
              <span className={styles.fixedLabelText}>{label}</span>
              {!!description && (
                <div
                  className={styles.selectHint}
                  id={hintId}
                >
                  {description}
                </div>
              )}
            </div>
          )}

          <select
            {...htmlAttributes}
            aria-describedby={errorMsg ? errorMsgId : hintId}
            aria-invalid={!!errorMsg}
            className={classNames(styles.select, {
              [styles.hasHiddenLabel]: hasHiddenLabel,
            })}
            data-noi="select-field"
            disabled={isDisabled}
            id={selectId}
            ref={ref}
          >
            {options.map((option, index) => {
              const { type } = option;

              if (type === 'divider') {
                return <hr key={`divider-${index}`} />;
              }

              return (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      {!!description && labelType !== 'fixed' && (
        <div
          className={styles.selectHint}
          id={hintId}
        >
          {description}
        </div>
      )}

      <VisuallyHidden
        aria-live={errorMsg ? 'assertive' : 'off'}
        id={errorMsgId}
      >
        {!!errorMsg && <div>{errorMsg}</div>}
      </VisuallyHidden>
    </div>
  );
});
