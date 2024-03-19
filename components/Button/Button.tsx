import classNames from "classnames";
import { forwardRef, useRef } from "react";

import { Icon } from "../Icon";
import { LoadingSpinner } from "../LoadingSpinner";

import styles from "./Button.module.css";
import { Props } from "./Button.types";

import {
  useMergeRefs,
  useMouseClickWithSound,
  useMouseEnterWithSound,
} from "@common-hooks";
import { WithChildren } from "@common-types";

export const Button = forwardRef<HTMLButtonElement, WithChildren<Props>>(
  function Button(
    {
      children,
      fit = "container",
      iconEnd,
      iconStart,
      isDisabled,
      isLoading,
      level = "primary",
      onClick,
      onMouseEnter,
      shape = "pill",
      size = "md",
      theme = "light",
      variant = "solid",
      ...htmlAttributes
    },
    externalRef
  ) {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = useMergeRefs([internalRef, externalRef]);

    /*
    The native HTML 'disabled' attribute is one of the rare cases where it does more harm than good.
    When using 'disabled' the element is not clickable, but it's also not focusable or readable by assistive technologies.
    Instead, we use aria-disabled and prevent click/press events manually.
    This way, disabled buttons can still be understood by assistive technologies.
    */
    function handleClick(
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
      if (isDisabled || isLoading) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    }

    const handleMouseEnterWithSound = useMouseEnterWithSound(onMouseEnter);
    const handleClickWithSound = useMouseClickWithSound(handleClick);

    return (
      <button
        {...(isDisabled && { "aria-disabled": true })}
        {...(isLoading && { "aria-busy": true })}
        className={classNames(
          styles.button,
          styles[fit],
          styles[shape],
          styles[size],
          styles[variant],
          styles[level],
          styles[theme]
        )}
        ref={ref}
        type="button"
        {...(!isDisabled &&
          !isLoading && { onMouseEnter: handleMouseEnterWithSound })}
        onClick={handleClickWithSound}
        {...htmlAttributes}
      >
        <div className={styles.buttonContent}>
          {iconStart && <Icon className={styles.buttonIcon} icon={iconStart} />}

          <div className={styles.buttonChildContentWrapper}>{children}</div>

          {iconEnd && <Icon className={styles.buttonIcon} icon={iconEnd} />}
        </div>

        {isLoading && !isDisabled && (
          <div className={styles.buttonLoadingWrapper}>
            <LoadingSpinner size="sm" />
          </div>
        )}
      </button>
    );
  }
);
