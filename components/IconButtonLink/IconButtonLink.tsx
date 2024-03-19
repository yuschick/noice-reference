import classNames from "classnames";
import { MouseEvent, forwardRef, useCallback } from "react";
import { Link, LinkProps } from "react-router-dom";

import buttonStyles from "../Button/Button.module.css";
import { Icon } from "../Icon/Icon";
import { BaseIconButtonProps } from "../IconButton/IconButton";
import iconButtonStyles from "../IconButton/IconButton.module.css";
import { VisuallyHidden } from "../VisuallyHidden";

import { useSoundController } from "@common-context";
import { useMouseEnterWithSound } from "@common-hooks";
import { CommonSoundKeys, WithChildren } from "@common-types";

type Props = LinkProps &
  WithChildren<Omit<BaseIconButtonProps, "isDisabled" | "isLoading">>;

export const IconButtonLink = forwardRef<HTMLAnchorElement, Props>(
  function IconButtonLink(
    {
      icon,
      label,
      level = "primary",
      onClick,
      onMouseEnter,
      size = "md",
      statusMessage,
      theme = "light",
      to,
      variant = "solid",
      ...htmlAttributes
    },
    externalRef
  ) {
    const classList = classNames(
      buttonStyles.button,
      buttonStyles.circle,
      buttonStyles[size],
      buttonStyles[variant],
      buttonStyles[level],
      buttonStyles[theme]
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
        aria-label={label}
        className={classList}
        data-type="icon"
        href={String(to)}
        ref={externalRef}
        rel="noopener noreferrer"
        target={htmlAttributes.reloadDocument ? undefined : "_blank"}
        onClick={handleOnClickWithSound}
        onMouseEnter={handleMouseEnterWithSound}
      >
        <IconButtonLinkContent
          icon={icon}
          statusMessage={statusMessage}
        ></IconButtonLinkContent>
        <VisuallyHidden>Link opens in a new window.</VisuallyHidden>
      </a>
    ) : (
      <Link
        {...htmlAttributes}
        aria-label={label}
        className={classList}
        data-type="icon"
        ref={externalRef}
        to={to}
        onClick={handleOnClickWithSound}
        onMouseEnter={handleMouseEnterWithSound}
      >
        <IconButtonLinkContent icon={icon} statusMessage={statusMessage} />
      </Link>
    );
  }
);

const IconButtonLinkContent = ({
  children,
  icon,
  statusMessage,
}: WithChildren<Pick<Props, "icon" | "statusMessage">>) => {
  return (
    <div className={iconButtonStyles.iconContentWrapper}>
      <Icon
        className={classNames(iconButtonStyles.iconButtonIcon, {
          [iconButtonStyles.indicatorClip]: !!statusMessage,
        })}
        icon={icon}
      />

      {!!children && <>{children}</>}

      {!!statusMessage && (
        <div
          aria-label={statusMessage}
          aria-live="polite"
          className={iconButtonStyles.statusIndicator}
          role="status"
        />
      )}
    </div>
  );
};
