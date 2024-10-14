import { useConnectionStatusChange } from '@noice-com/card-game';
import { LoadingSpinner, WithChildren } from '@noice-com/common-ui';
import { ConnectionState } from '@noice-com/platform-client';
import classNames from 'classnames';
import { RiSignalWifiErrorLine } from 'react-icons/ri';

import styles from './ConnectionStatusBar.module.css';

export type Props = WithChildren<{
  show?: boolean;
  hasError?: boolean;
}>;

export function StatusBar({ show, hasError, children }: Props) {
  return (
    <div
      className={classNames(styles.container, {
        [styles.hasError]: !!hasError,
        [styles.hide]: !show,
      })}
    >
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
}

interface ErrorishProps {
  code: number;
  message: string;
}

export function ReconnectingMessage({ code, message }: ErrorishProps) {
  return (
    <div className={styles.messageWrapper}>
      <div className={styles.errorLabel}>
        <LoadingSpinner size="sm" />
        <span>
          Attempting to reconnect to game server. Refreshing the page may speed this up.
        </span>
      </div>

      <div className={styles.codeLabel}>
        Error: {message} (code: {code})
      </div>
    </div>
  );
}

export function DisconnectedMessage({ code, message }: ErrorishProps) {
  return (
    <div className={styles.messageWrapper}>
      <div className={styles.errorLabel}>
        <RiSignalWifiErrorLine className={styles.disconnectIcon} />
        <span>
          Disconnected from game server. Try refreshing the page to start playing.
        </span>
      </div>

      <div className={styles.codeLabel}>
        Error: {message} (code: {code})
      </div>
    </div>
  );
}

export function ConnectionStatusBar() {
  const { hide, state, error } = useConnectionStatusChange();

  const isFinalDisconnect = state === ConnectionState.DISCONNECTED && !!error;
  const errorishState = isFinalDisconnect || state === ConnectionState.RECONNECTING;

  return (
    <StatusBar
      hasError={errorishState}
      show={!hide}
    >
      {state === ConnectionState.RECONNECTING && (
        <ReconnectingMessage
          code={error?.code ?? 0}
          message={error?.reason ?? 'Unspecified error'}
        />
      )}
      {isFinalDisconnect && (
        <DisconnectedMessage
          code={error?.code ?? 0}
          message={error?.reason ?? 'Unspecified error'}
        />
      )}
      {state === ConnectionState.CONNECTED && (
        <div className={styles.goodLabel}>Connected!</div>
      )}
    </StatusBar>
  );
}
