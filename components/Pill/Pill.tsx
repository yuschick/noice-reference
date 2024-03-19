import classNames from "classnames";
import { CSSProperties, HTMLAttributes } from "react";

import { Icon } from "../Icon";

import styles from "./Pill.module.css";

import { SvgComponent } from "@common-types";

export const pillColors = [
  "gradient-green-teal",
  "gradient-violet-magenta",
  "gradient-violet",
  "blue-750",
  "blue-950",
  "gray-750",
  "gray-950",
  "status-error-main",
] as const;

interface Props
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    "className" | "style" | "title"
  > {
  label: string;
  iconEnd?: SvgComponent;
  iconStart?: SvgComponent;
  theme: (typeof pillColors)[number];
  title?: string;
}

export function Pill({
  label,
  iconEnd,
  iconStart,
  theme,
  title,
  ...htmlAttributes
}: Props) {
  return (
    <span
      {...htmlAttributes}
      className={classNames(styles.pill)}
      style={
        {
          "--_pill-background": theme.startsWith("gradient")
            ? `var(--noi-${theme})`
            : `var(--noi-color-${theme})`,
          "--_pill-color":
            theme === "gradient-green-teal"
              ? "var(--noi-color-text-dark)"
              : "var(--noi-color-text-light)",
        } as CSSProperties
      }
      title={title}
    >
      {iconStart && <Icon icon={iconStart} size={16} />}

      <span className={styles.text}>{label}</span>

      {iconEnd && <Icon icon={iconEnd} size={16} />}
    </span>
  );
}
