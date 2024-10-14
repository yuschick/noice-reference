import { RefObject } from 'react';

import styles from './SettingsInput.module.css';

import { Button } from '@common/button';

interface Props {
  label: string;
  placeholder?: string;
  triggerButtonRef: RefObject<HTMLButtonElement>;
  popoutId: string;
  isPopoutOpen: boolean;
  isDisabled?: boolean;
  defaultValue?: string;
  onTriggerButtonClick(): void;
  onResetClick?(): void;
}

export function SettingsInput({
  label,
  placeholder,
  triggerButtonRef,
  isDisabled,
  defaultValue,
  onTriggerButtonClick,
  popoutId,
  isPopoutOpen,
  onResetClick,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}</span>

      <div className={styles.content}>
        <span className={styles.value}>{defaultValue || placeholder}</span>

        <div className={styles.actions}>
          <Button
            aria-controls={popoutId}
            aria-expanded={isPopoutOpen ? true : false}
            buttonType="primary"
            disabled={isDisabled}
            ref={triggerButtonRef}
            size="small"
            text={`Change ${label}`}
            onClick={onTriggerButtonClick}
          />

          {!!defaultValue && onResetClick && (
            <Button
              buttonType="ghost"
              size="small"
              text="Reset to default"
              onClick={onResetClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
