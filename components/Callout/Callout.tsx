import { CoreAssets } from "@noice-com/assets-core";
import classNames from "classnames";
import { ReactNode, forwardRef } from "react";

import { Icon } from "../Icon";
import { IconButton } from "../IconButton";

import styles from "./Callout.module.css";

import { SvgComponent } from "@common-types";

export const calloutThemes = ["blue", "gray", "type"] as const;
export const calloutTypes = ["error", "info", "success", "warning"] as const;

export const calloutVariants = ["bordered", "filled"] as const;

interface Props {
  /**
   * When the callout is live, as in a refresh is not required for it to appear,
   * ensure this prop is true so that screen readers will announce the message
   */
  isLive?: boolean;
  message: string | ReactNode;
  slots?: {
    /**
     * Overwrite the default dismiss button with custom action(s)
     */
    actions?: {
      primary: ReactNode;
      secondary?: ReactNode;
    };
    /**
     * Overwrite the default icon for the callout type
     */
    icon?: SvgComponent;
  };
  theme?: (typeof calloutThemes)[number];
  type: (typeof calloutTypes)[number];
  variant?: (typeof calloutVariants)[number];
  onDismiss?: () => void;
}

function getCalloutIcon(type: Props["type"]): SvgComponent {
  switch (type) {
    case "error":
      return CoreAssets.Icons.Error;
    case "info":
      return CoreAssets.Icons.Info;
    case "success":
      return CoreAssets.Icons.Check;
    case "warning":
      return CoreAssets.Icons.Exclamation;
    default:
      return CoreAssets.Icons.Info;
  }
}

export const Callout = forwardRef<HTMLDivElement, Props>(function Callout(
  {
    isLive,
    message,
    onDismiss,
    slots,
    theme = "type",
    type,
    variant = "filled",
  },
  externalRef
) {
  const icon = slots?.icon ?? getCalloutIcon(type);

  return (
    <div
      {...(isLive ? { "aria-live": "polite" } : {})}
      className={classNames(
        styles.calloutWrapper,
        styles[type],
        styles[theme],
        variant ? styles[variant] : null
      )}
      ref={externalRef}
    >
      <Icon className={styles.calloutIcon} icon={icon} size={24} />

      {message}

      {!!slots?.actions && (
        <>
          {!!slots?.actions.secondary && <>{slots.actions.secondary}</>}
          {!!slots?.actions.primary && <>{slots.actions.primary}</>}
        </>
      )}

      {!slots?.actions && onDismiss && (
        <IconButton
          theme={type === "error" || theme !== "type" ? "light" : "dark"}
          icon={CoreAssets.Icons.Close}
          label="Dismiss message"
          size="xs"
          variant="ghost"
          onClick={onDismiss}
        />
      )}
    </div>
  );
});
