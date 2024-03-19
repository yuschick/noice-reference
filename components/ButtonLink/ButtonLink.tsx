import classNames from "classnames";
import { MouseEvent, forwardRef, useCallback } from "react";
import { Link, LinkProps } from "react-router-dom";

import styles from "../Button/Button.module.css";
import {
  ButtonBaseProps,
  ButtonFitProps,
  ButtonIconPositions,
} from "../Button/Button.types";
import { Icon } from "../Icon";
import { VisuallyHidden } from "../VisuallyHidden";

import { useSoundController } from "@common-context";
import { useMouseEnterWithSound } from "@common-hooks";
import { CommonSoundKeys, WithChildren } from "@common-types";

type Props = LinkProps &
  WithChildren<
    Omit<ButtonBaseProps, "isDisabled" | "isLoading"> &
      ButtonIconPositions &
      ButtonFitProps
  >;

export const ButtonLink = forwardRef<HTMLAnchorElement, Props>(
  function ButtonLink(
    {
      children,
      fit = "container",
      iconEnd,
      iconStart,
      level = "primary",
      onClick,
      onMouseEnter,
      shape = "pill",
      size = "md",
      theme = "light",
      to,
      variant = "solid",
      ...htmlAttributes
    },
    externalRef
  ) {
    const classList = classNames(
      styles.button,
      styles[fit],
      styles[shape],
      styles[size],
      styles[variant],
      styles[level],
      styles[theme]
    );
    const handleMouseEnterWithSound = useMouseEnterWithSound(onMouseEnter);

    // Using soundController instead of usePlaySound because component, usePlaySound hook and the sound
    // may be destroyed on navigate and then sound does not have no time to play so there would not be sound
    const soundController = useSoundController();
    const isExternalLink = String(to).startsWith("http");

    const handleOnClickWithSound = useCallback(
      (event: MouseEvent<HTMLAnchorElement>) => {
        soundController.playSound(CommonSoundKeys.ButtonClickConfirm);
        onClick?.(event);
      },
      [onClick, soundController]
    );

    return isExternalLink ? (
      <a
        {...htmlAttributes}
        className={classList}
        href={String(to)}
        ref={externalRef}
        rel="noopener noreferrer"
        target={htmlAttributes.reloadDocument ? undefined : "_blank"}
        onClick={handleOnClickWithSound}
        onMouseEnter={handleMouseEnterWithSound}
      >
        <ButtonLinkContent iconEnd={iconEnd} iconStart={iconStart}>
          {children}
          <VisuallyHidden>Link opens in a new window.</VisuallyHidden>
        </ButtonLinkContent>
      </a>
    ) : (
      <Link
        {...htmlAttributes}
        className={classList}
        ref={externalRef}
        to={to}
        onClick={handleOnClickWithSound}
        onMouseEnter={handleMouseEnterWithSound}
      >
        <ButtonLinkContent iconEnd={iconEnd} iconStart={iconStart}>
          {children}
        </ButtonLinkContent>
      </Link>
    );
  }
);

const ButtonLinkContent = ({
  children,
  iconEnd,
  iconStart,
}: WithChildren<Pick<Props, "children" | "iconEnd" | "iconStart">>) => {
  return (
    <div className={styles.buttonContent}>
      {iconStart && <Icon className={styles.buttonIcon} icon={iconStart} />}

      {!!children && (
        <div className={styles.buttonChildContentWrapper}>{children}</div>
      )}

      {iconEnd && <Icon className={styles.buttonIcon} icon={iconEnd} />}
    </div>
  );
};
