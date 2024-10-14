import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { StreamError } from '@noice-com/stream';
// We need to import this directly because of @livepeer related importing issue with jest
// eslint-disable-next-line no-restricted-imports
import { SimpleStreamPlayer } from '@noice-com/stream/src/components/SimpleStreamPlayer';

import styles from './GameDisabledStream.module.css';

interface Props {
  placement: StreamPlacement;
  streamId: string;
  onErrorCallback?(error: StreamError): void;
}

export function GameDisabledStream({ placement, streamId, onErrorCallback }: Props) {
  return (
    <div className={styles.container}>
      <SimpleStreamPlayer
        placement={placement}
        streamId={streamId}
        hideSpotlights
        onErrorCallback={onErrorCallback}
      />
    </div>
  );
}
