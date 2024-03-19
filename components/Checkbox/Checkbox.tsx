import classNames from "classnames";
import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";

import { InteractiveInputDescription } from "../InteractiveInputDescription";
import { InteractiveInputLabel } from "../InteractiveInputLabel";

import styles from "./Checkbox.module.css";

interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "name" | "style" | "type"
  > {
  label: string | ReactNode;
  description?: string;
  labelType?: "hidden" | "visible";
  name: string;
  theme?: "dark" | "light";
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  {
    label,
    labelType = "visible",
    disabled,
    name,
    description,
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
      className={classNames(styles.checkboxRoot, styles[theme], {
        [styles.disabled]: disabled,
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
