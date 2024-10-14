import classNames from 'classnames';
import {
  ChangeEvent,
  TextareaHTMLAttributes,
  forwardRef,
  useId,
  useRef,
  useState,
} from 'react';

import { BaseInputProps } from '../InputField/InputField';
import inputStyles from '../InputField/InputField.module.css';
import { VisuallyHidden } from '../VisuallyHidden';

import styles from './TextArea.module.css';

import { useMergeRefs } from '@common-hooks';

type BaseTextAreaProps = Omit<BaseInputProps, 'inputSize' | 'slots'>;

type TextAreaHTMLProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'className'
  | 'color'
  | 'id'
  | 'placeholder'
  | 'style'
>;

type Props = TextAreaHTMLProps &
  BaseTextAreaProps & {
    showCharacterCount?: boolean;
  };

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  {
    description,
    error,
    isDisabled,
    label,
    labelType = 'floating',
    showCharacterCount,
    theme = 'light',
    ...htmlAttributes
  },
  externalRef,
) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const ref = useMergeRefs([internalRef, externalRef]);
  const [characterCount, setCharacterCount] = useState<number>(
    (htmlAttributes.defaultValue?.toString() ?? '').length,
  );

  const onValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCharacterCount(event.target.value.length);
    htmlAttributes?.onChange?.(event);
  };

  const errorMsgId = useId();
  const hintId = useId();
  const countId = useId();
  const textAreaId = useId();
  const hasHiddenLabel = labelType === 'hidden';

  return (
    <div
      className={classNames(
        inputStyles.inputAndDescriptionWrapper,
        inputStyles[theme],
        inputStyles.lg,
      )}
    >
      <div className={inputStyles.inputAndSlotsWrapper}>
        <label
          className={inputStyles.inputLabelWrapper}
          htmlFor={textAreaId}
        >
          <textarea
            {...htmlAttributes}
            aria-describedby={error?.message ? errorMsgId : `${hintId} ${countId}`}
            aria-invalid={!!error?.message}
            className={classNames(styles.textArea, inputStyles.inputField, {
              [styles.multiline]: htmlAttributes.rows && htmlAttributes.rows > 1,
              [styles.hasHiddenLabel]: hasHiddenLabel,
            })}
            data-noi="text-area"
            disabled={isDisabled}
            id={textAreaId}
            placeholder=" "
            ref={ref}
            onChange={onValueChange}
          />
          {hasHiddenLabel ? (
            <VisuallyHidden>{label}</VisuallyHidden>
          ) : (
            <span className={classNames(styles.textAreaLabelText, inputStyles.labelText)}>
              {label}
            </span>
          )}
        </label>
      </div>

      {(!!description || showCharacterCount || !!error?.message) && (
        <div className={classNames(styles.belowInput, inputStyles.inputSecondaryWrapper)}>
          {!!description && (
            <div
              className={classNames(inputStyles.inputDescription, styles.description)}
              id={hintId}
            >
              {description}
            </div>
          )}

          {showCharacterCount && !!htmlAttributes.maxLength && (
            <VisuallyHidden id={countId}>
              {htmlAttributes.maxLength - characterCount} characters remaining
            </VisuallyHidden>
          )}

          <div
            aria-live={error?.message ? 'assertive' : 'off'}
            id={errorMsgId}
          >
            {!!error?.message && (
              <>
                {error.type === 'visible' ? (
                  <div className={inputStyles.error}>{error.message}</div>
                ) : (
                  <VisuallyHidden>{error.message}</VisuallyHidden>
                )}
              </>
            )}
          </div>

          {showCharacterCount && (
            <div
              aria-live="polite"
              className={styles.charAmount}
              id={countId}
            >
              {characterCount}
              {!!htmlAttributes.maxLength && ` / ${htmlAttributes.maxLength}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
