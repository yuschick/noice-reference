import { Anchor, ButtonLink, LoadingSpinner, VisuallyHidden } from '@noice-com/common-ui';
import { MouseEventHandler } from 'react';

import { useGithubReleases } from './hooks/useGithubReleases.hook';
import styles from './NoicePlugin.module.css';

interface Props {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  hideVersion?: boolean;
}

export function NoicePlugin({ hideVersion, onClick }: Props) {
  const { releases, loading: isLoadingReleases, error } = useGithubReleases();

  return (
    <div className={styles.buttonsVersionWrapper}>
      <div className={styles.buttonsWrapper}>
        {isLoadingReleases && <LoadingSpinner />}

        {error && (
          <p>
            We have failed to fetch the current release of the Noice Plugin. But you can
            refresh to try again or view the{' '}
            <Anchor href="https://github.com/noice-com/obs-noice/releases/latest">
              latest release on Github
            </Anchor>
            .
          </p>
        )}

        {!isLoadingReleases &&
          !error &&
          releases.map((release) => (
            <ButtonLink
              fit="content"
              key={release.platform}
              level={release.platform === 'windows' ? 'primary' : 'secondary'}
              rel="noopener noreferrer"
              size="sm"
              target="_blank"
              to={release.url}
              onClick={onClick}
            >
              {release.platform}
              <VisuallyHidden>Opens in a new window</VisuallyHidden>
            </ButtonLink>
          ))}
      </div>

      {!hideVersion && !isLoadingReleases && !error && (
        <p className={styles.descriptionText}>Version {releases?.[0]?.version}</p>
      )}
    </div>
  );
}
