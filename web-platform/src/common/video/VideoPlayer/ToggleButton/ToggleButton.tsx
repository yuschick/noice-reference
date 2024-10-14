import { IconButton, SvgComponent } from '@noice-com/common-ui';

export interface ToggleButtonProps {
  on: boolean;
  onIcon: SvgComponent;
  offIcon: SvgComponent;
  onLabel: string;
  offLabel: string;
  onClick?(on: boolean): void;
}

export function ToggleButton({
  on,
  onIcon,
  offIcon,
  onLabel,
  offLabel,
  onClick,
}: ToggleButtonProps) {
  return (
    <IconButton
      icon={on ? onIcon : offIcon}
      label={on ? onLabel : offLabel}
      variant="ghost"
      onClick={() => onClick?.(!on)}
    />
  );
}
