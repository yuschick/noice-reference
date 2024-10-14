import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { StreamError } from '@noice-com/stream';
// We need to import this directly because of @livepeer related importing issue with jest
// eslint-disable-next-line no-restricted-imports
import { SimpleStreamPlayer } from '@noice-com/stream/src/components/SimpleStreamPlayer';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './TheaterModeStream.module.css';

interface Props {
  streamId: string;
  groupId: Nullable<string>;
  isMinimizedStream?: boolean;
  placement: StreamPlacement;
  onErrorCallback?(error: StreamError): void;
}

export function TheaterModeStream({
  streamId,
  groupId,
  isMinimizedStream,
  onErrorCallback,
  placement,
}: Props) {
  return (
    <div
      className={classNames(styles.container, {
        [styles.minimized]: !!isMinimizedStream,
      })}
    >
      <SimpleStreamPlayer
        className={styles.streamPlayer}
        groupId={groupId}
        hideSpotlights={isMinimizedStream}
        placement={placement}
        streamId={streamId}
        hideSpotlightsEmotes
        onErrorCallback={onErrorCallback}
      />

      {!isMinimizedStream && <div className={styles.bottomBar} />}
    </div>
  );
}
