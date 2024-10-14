import { CoreAssets } from '@noice-com/assets-core';
import { ErrorFallbackProps, IconButton, Button } from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import { useState } from 'react';

import styles from './CardGameErrorFallback.module.css';

const { logWarn } = makeLoggers('CardGameErrorFallback');

// @todo: Provide some way of recovering/retrying?
export function CardGameErrorFallback({ error }: ErrorFallbackProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyError = async () => {
    try {
      await navigator.clipboard.writeText(
        `Message: ${error.message}\nStack: ${error.stack}`,
      );
      setCopied(true);
    } catch (e) {
      logWarn('failed to copy error', e);
    }
  };

  const toggleShowError = () => {
    setShowError((previous) => !previous);
  };

  return dismissed ? null : (
    <div className={styles.wrapper}>
      <div className={styles.panel}>
        <div className={styles.errorTitle}>
          <span>Something went wrong</span>

          <IconButton
            icon={CoreAssets.Icons.Close}
            label="Dismiss error"
            level="secondary"
            size="xs"
            onClick={() => setDismissed(true)}
          />
        </div>

        <div className={styles.errorDescription}>
          There was an error that caused the game to crash. Refresh your browser to try
          again. If the issue continues, please let us know about the error below.
        </div>

        {showError ? (
          <pre className={styles.errorStack}>{error.stack}</pre>
        ) : (
          <div className={styles.errorPreview}>Error: {error.message}</div>
        )}

        <div className={styles.errorFooter}>
          <div>
            <Button
              iconEnd={copied ? CoreAssets.Icons.Check : CoreAssets.Icons.Duplicate}
              isDisabled={copied}
              level="secondary"
              size="sm"
              onClick={handleCopyError}
            >
              {copied ? 'Copied' : 'Copy error'}
            </Button>
          </div>

          <div>
            <Button
              level="secondary"
              size="sm"
              onClick={toggleShowError}
            >
              {showError ? 'Hide full error' : 'Show full error'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function withHideableFallback(shouldHide: boolean) {
  return shouldHide ? () => null : CardGameErrorFallback;
}
