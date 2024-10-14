import { useStringFeatureFlag } from '@noice-com/common-react-core';
import { useEffect, useState } from 'react';

export type Release = {
  platform: 'linux' | 'mac' | 'windows';
  url: string;
  version: string;
};

/* eslint-disable @typescript-eslint/naming-convention */
type GitHubAsset = {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
};

const REGEX_MATCH_VERSION = /download\/(.*?)\//g;
/* eslint-enable @typescript-eslint/naming-convention */

// Replaces the original url with given version tag
// e.g. "https://github.com/noice-com/obs-noice/releases/download/1.2.0/noice-1.2.0-linux-x86_64.deb
// would become "https://github.com/noice-com/obs-noice/releases/download/<VERSION>/noice-<VERSION>-linux-x86_64.deb"
function replaceVersionUrl(url: string, version: string): string {
  const matches = [...url.matchAll(REGEX_MATCH_VERSION)].map((match) => match[1]);
  const foundVersion = matches[0];
  if (!foundVersion) {
    return url;
  }
  return url.replaceAll(foundVersion, version);
}

export function useGithubReleases() {
  const [obsPluginVersion] = useStringFeatureFlag('obsPluginVersion', '');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    setError(false);
    fetch(NOICE.NOICE_OBS_PLUGIN_GITHUB_API_URL)
      .then((res) => res.json())
      .then((data) => {
        const linux = data.assets.find((asset: GitHubAsset) =>
          asset.name.includes('linux'),
        );

        const mac = data.assets.find((asset: GitHubAsset) =>
          asset.name.includes('macos-universal'),
        );

        const windows = data.assets.find((asset: GitHubAsset) =>
          asset.name.includes('windows'),
        );

        setReleases([
          {
            platform: 'windows',
            url: obsPluginVersion
              ? replaceVersionUrl(windows['browser_download_url'], obsPluginVersion)
              : windows['browser_download_url'],
            version: obsPluginVersion || data.tag_name,
          },
          {
            platform: 'mac',
            url: obsPluginVersion
              ? replaceVersionUrl(mac['browser_download_url'], obsPluginVersion)
              : mac['browser_download_url'],
            version: obsPluginVersion || data.tag_name,
          },
          {
            platform: 'linux',
            url: obsPluginVersion
              ? replaceVersionUrl(linux['browser_download_url'], obsPluginVersion)
              : linux['browser_download_url'],
            version: obsPluginVersion || data.tag_name,
          },
        ]);
        setLoading(false);
        return;
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [obsPluginVersion]);

  return { error, loading, releases };
}
