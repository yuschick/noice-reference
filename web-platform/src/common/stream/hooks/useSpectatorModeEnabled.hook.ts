import { useURLSearch } from '@noice-com/common-ui';

export function useSpectatorModeEnabled(): boolean {
  const [, getSearchField] = useURLSearch();

  return Boolean(getSearchField<boolean>('spectator'));
}
