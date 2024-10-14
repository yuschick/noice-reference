import { getErrorMessage } from '@noice-com/utils';
import { useEffect, useState } from 'react';

type LatestGameConnect = {
  url: string;
  version: string;
  loading: boolean;
  error: string | null;
};

// Note: Not using a proper YAML library here because it feels like overkill as
// there is no other YMAL parsing in this codebase.
const VersionRegex = /^version:\W([.\d]*)$/m;
const PathRegex = /^path:\W(.*)$/m;
const ENDPOINT_BASE = NOICE.GAME_CONNECT_URL.slice(
  0,
  NOICE.GAME_CONNECT_URL.lastIndexOf('/'),
);

export function useGameConnectInfo(): LatestGameConnect {
  const [status, setStatus] = useState<LatestGameConnect>({
    url: '',
    version: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const manifest = await window.fetch(NOICE.GAME_CONNECT_URL);
        const rawYaml = await manifest.text();

        const versionMatch = VersionRegex.exec(rawYaml);
        const executableMatch = PathRegex.exec(rawYaml);

        if (!versionMatch || !executableMatch) {
          throw new Error('Invalid manifest format');
        }

        const version = versionMatch[1];
        const execPath = encodeURIComponent(executableMatch[1]);
        const url = `${ENDPOINT_BASE}/${execPath}`;

        setStatus({
          url,
          version,
          loading: false,
          error: null,
        });
      } catch (err) {
        setStatus({
          url: '',
          version: '',
          loading: false,
          error: getErrorMessage(err),
        });
      }
    };

    fetch();
  }, []);

  return status;
}
