import { ButtonLink, LoadingSpinner, VisuallyHidden } from '@noice-com/common-ui';

import styles from './GameConnectLink.module.css';

import { useGameConnectInfo } from '@common/stream';

interface Props {
  hideVersion?: boolean;
}

export function GameConnectLink({ hideVersion }: Props) {
  const { error, url, version, loading } = useGameConnectInfo();

  return (
    <div className={styles.buttonsVersionWrapper}>
      <div className={styles.buttonsWrapper}>
        {loading && <LoadingSpinner />}

        {!!error && (
          <p>
            We have failed to fetch the latest release of the Noice Game Connect, but you
            can refresh to try again.
          </p>
        )}

        {!loading && !error && (
          <ButtonLink
            fit="content"
            level="primary"
            rel="noopener noreferrer"
            size="sm"
            target="_blank"
            to={url}
          >
            Download for Windows
            <VisuallyHidden>Opens in a new window</VisuallyHidden>
          </ButtonLink>
        )}
      </div>

      {!hideVersion && !loading && !error && (
        <p className={styles.descriptionText}>Latest version {version}</p>
      )}
    </div>
  );
}
