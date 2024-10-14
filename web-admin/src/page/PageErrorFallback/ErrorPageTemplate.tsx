import { useState } from 'react';

import styles from './ErrorPageTemplate.module.css';

/**
 * DO NOT ADD ANY OTHER COMPONENTS TO THIS FILE.
 * We do not want have accidental unwanted dependencies, like sound control.
 */

export interface Props {
  title: string;
  description: string;
  error: Error;
}
export function ErrorPageTemplate({ title, description, error }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(
        `URL: ${window.location.href}\nError: ${error.stack}`,
      );
      setCopied(true);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('failed to copy error', e);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      <p className={styles.description}>{description}</p>

      <div className={styles.errorContainer}>
        <h2 className={styles.errorTitle}>
          {error.name}: {error.message}
        </h2>
        <pre className={styles.stack}>{error.stack}</pre>

        <button
          className={styles.copyBtn}
          disabled={copied}
          onClick={handleCopyClick}
        >
          {copied ? 'Copied' : 'Copy error'}
        </button>
      </div>
    </div>
  );
}
