import classNames from "classnames";
import {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useEffect,
  useId,
  useRef,
} from "react";

import { VisuallyHidden } from "../VisuallyHidden";

import styles from "./InputField.module.css";

import { useMergeRefs } from "@common-hooks";

export const inputFieldColors = ["blue", "gray", "light"] as const;
export const inputFieldSizes = ["sm", "md", "lg"] as const;

export type BaseInputProps = {
  theme?: (typeof inputFieldColors)[number];
  error?: {
    message: string;
    type?: "hidden" | "visible";
  };
  description?: string;
  inputSize?: InputHTMLAttributes<HTMLInputElement>["size"];
  isDisabled?: boolean;
  label: string;
  labelType?: "floating" | "hidden";
  size?: (typeof inputFieldSizes)[number];
  slots?: {
    inputEnd?: ReactNode;
    inputStart?: ReactNode;
  };
};

type InputHTMLProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "aria-describedby"
  | "aria-invalid"
  | "className"
  | "disabled"
  | "id"
  | "placeholder"
  | "size"
  | "style"
>;

export type InputFieldProps = InputHTMLProps & BaseInputProps;

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      error,
      description,
      inputSize,
      isDisabled,
      label,
      labelType = "floating",
      size = "md",
      slots,
      theme = "light",
      ...htmlAttributes
    },
    externalRef
  ) {
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = useMergeRefs([internalRef, externalRef]);

    const errorMsgId = useId();
    const descriptionId = useId();
    const inputId = useId();
    const hasHiddenLabel = labelType === "hidden";

    useEffect(() => {
      const input = internalRef.current;

      if (!error?.message || !input) {
        return;
      }

      /**
       * Whenever a field has an error, we want to immediately focus it to describe the error and give a chance to fix it.
       * In the case of a form that may have multiple errors, we focus the first field with an error.
       */
      const firstInputWithError = document.querySelector<HTMLInputElement>(
        'input[aria-invalid="true"]:first-of-type'
      );

      if (input === firstInputWithError) {
        // @ts-ignore
        input.focus({ focusVisible: true });
      }
    }, [error?.message]);

    useEffect(() => {
      // Set input to be invalid if there is an error message
      internalRef.current?.setCustomValidity(
        error?.message ? error.message : ""
      );
    }, [error?.message]);

    return (
      <div
        className={classNames(
          styles.inputAndDescriptionWrapper,
          styles[theme],
          styles[size]
        )}
      >
        <div className={styles.inputAndSlotsWrapper}>
          {!!slots?.inputStart && (
            <div className={styles.slotStart}>{slots.inputStart}</div>
          )}

          <label className={styles.inputLabelWrapper} htmlFor={inputId}>
            <input
              {...{ ...htmlAttributes, size: inputSize }}
              aria-describedby={`${descriptionId} ${errorMsgId}`}
              aria-invalid={!!error?.message}
              className={styles.inputField}
              data-noi="input-field"
              disabled={isDisabled}
              id={inputId}
              placeholder=" "
              ref={ref}
            />

            {hasHiddenLabel ? (
              <VisuallyHidden>{label}</VisuallyHidden>
            ) : (
              <span className={styles.labelText}>{label}</span>
            )}
          </label>

          {!!slots?.inputEnd && (
            <div className={styles.slotEnd}>{slots.inputEnd}</div>
          )}
        </div>

        <div className={styles.inputSecondaryWrapper}>
          {!!description && (
            <div className={styles.inputDescription} id={descriptionId}>
              {description}
            </div>
          )}

          <div aria-live={error?.message ? "assertive" : "off"} id={errorMsgId}>
            {!!error?.message && (
              <>
                {error.type === "visible" ? (
                  <div className={styles.error}>{error.message}</div>
                ) : (
                  <VisuallyHidden>{error.message}</VisuallyHidden>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);
