import { useMountEffect } from '@noice-com/common-react-core';
import {
  Button,
  KeyboardKeys,
  useAnalytics,
  useKeyPress,
  useOnOutsideClick,
} from '@noice-com/common-ui';
import { useRef } from 'react';

import styles from './InactivityKickPrompt.module.css';

export interface PromptProps {
  onClose(): void;
}

export function InactivityKickPrompt({ onClose }: PromptProps) {
  const promptRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();

  useOnOutsideClick(promptRef, onClose);
  useKeyPress(KeyboardKeys.Escape, onClose);

  useMountEffect(() => {
    trackEvent({ clientInactivityKickPromptShown: {} });
  });

  return (
    <>
      <div className={styles.overlay} />
      <div
        className={styles.promptWrapper}
        ref={promptRef}
      >
        <h3 className={styles.title}>
          You have been removed from the game due to inactivity.
        </h3>
        <div className={styles.actions}>
          <Button onClick={onClose}>OK</Button>
        </div>
      </div>
    </>
  );
}
