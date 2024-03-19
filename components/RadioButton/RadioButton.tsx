import classNames from "classnames";
import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";

import { InteractiveInputDescription } from "../InteractiveInputDescription";
import { InteractiveInputLabel } from "../InteractiveInputLabel";

import styles from "./RadioButton.module.css";

interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "name" | "style" | "type"
  > {
  theme?: "dark" | "light";
  label: string | ReactNode;
  description?: string;
  labelType?: "hidden" | "visible";
  name: string;
}

export const RadioButton = forwardRef<HTMLInputElement, Props>(
  function RadioButton(
    {
      label,
      disabled,
      description,
      labelType = "visible",
      name,
      theme = "light",
      ...htmlAttributes
    },
    externalRef
  ) {
    const descriptionId = useId();

    const showLabel = labelType !== "hidden";
    const showDescription = !!description && showLabel;

    return (
      <div
        className={classNames(styles.radioButtonRoot, styles[theme], {
          [styles.disabled]: disabled,
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
  }
);
