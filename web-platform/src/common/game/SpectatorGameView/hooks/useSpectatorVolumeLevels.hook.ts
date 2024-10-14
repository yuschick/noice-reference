import { useEffectsVolume, useMasterVolume, useStreamVolume } from '@noice-com/common-ui';
import { useEffect } from 'react';

export function useSpectatorVolumeLevels(): void {
  const [, setMasterVolume] = useMasterVolume();
  const [, setEffectsVolume] = useEffectsVolume();
  const [, setStreamVolume] = useStreamVolume();

  useEffect(() => {
    // Here we define the wanted volume levels for the spectator mode
    setMasterVolume(0.5);
    setEffectsVolume(0.35);
    setStreamVolume(1);
  }, [setMasterVolume, setEffectsVolume, setStreamVolume]);
}
