import styles from './UnsupportedBrowser.module.css';

export function UnsupportedBrowserWarning() {
  return (
    <div
      className={styles.unsupportedBrowserWarning}
      role="alert"
    >
      <p>
        Noice is currently only available in <strong>Google Chrome</strong>,{' '}
        <strong>Microsoft Edge</strong>, <strong>Opera</strong> and <strong>Brave</strong>
        .
      </p>
    </div>
  );
}
