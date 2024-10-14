import { gql } from '@apollo/client';
import { LoadingSpinner, WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';

import { useJoinGameClick } from './hooks/useJoinGameClick.hook';
import styles from './LiveChannelButtonWrapper.module.css';

import { LiveChannelButtonWrapperChannelFragment } from '@gen';

gql`
  fragment LiveChannelButtonWrapperChannel on ChannelChannel {
    name
    ...JoinGameClickChannel
  }
`;

interface Props {
  channel: LiveChannelButtonWrapperChannelFragment;
  className: string;
  buttonClassName: string;
  hasTooManyViewers: boolean;
  cannotJoinGameFromParty: boolean;
}

export function LiveChannelButtonWrapper({
  children,
  channel,
  className,
  buttonClassName,
  hasTooManyViewers,
  cannotJoinGameFromParty,
}: WithChildren<Props>) {
  const { joinGameButtonLoading, onJoinGameClick } = useJoinGameClick({ channel });

  if (hasTooManyViewers || cannotJoinGameFromParty) {
    return <div className={className}>{children}</div>;
  }

  const { name } = channel;

  return (
    <button
      aria-label={`Play ${name} stream`}
      className={classNames(className, buttonClassName)}
      disabled={joinGameButtonLoading}
      onClick={onJoinGameClick}
    >
      {children}

      {joinGameButtonLoading && (
        <div className={styles.buttonLoadingWrapper}>
          <LoadingSpinner />
        </div>
      )}
    </button>
  );
}
