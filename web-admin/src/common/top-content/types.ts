import { RefObject } from 'react';
import { IconType } from 'react-icons';

export interface ButtonAction {
  text: string;
  icon: IconType;
  isDisabled?: boolean;
  ref?: RefObject<HTMLButtonElement>;
  onClick(): void;
}

export interface LinkAction {
  text: string;
  href: string;
}

export interface ToggleAction {
  label: string;
  onChange: () => void;
  value: boolean;
}

export type TopAction =
  | (ButtonAction & { type: 'button' })
  | (LinkAction & { type: 'link' })
  | (ToggleAction & { type: 'toggle' });

export interface TopLabel {
  value: number;
  label: string;
}

export interface TopFilter {
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string[];
  onChange(values: string[]): void;
}
