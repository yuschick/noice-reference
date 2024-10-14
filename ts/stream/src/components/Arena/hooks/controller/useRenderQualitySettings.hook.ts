import { useEffect } from 'react';

import { ArenaControllerType } from '../../types';

import { useStreamSettings } from '@stream-context';

interface Props {
  arenaController: ArenaControllerType;
}

export function useRenderQualitySettings({ arenaController }: Props) {
  const { performanceProfile } = useStreamSettings();

  useEffect(() => {
    arenaController?.setRenderQualitySettings(performanceProfile);
  }, [arenaController, performanceProfile]);
}
