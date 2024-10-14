import { useCallback, useEffect, useState } from 'react';

import { LocalUserData } from '@common-classes';
import { useSoundController, useLocalStorage } from '@common-context';

function safeVolumeValue(
  storageKey: 'audio.volume.master' | 'audio.volume.effects' | 'audio.volume.stream',
  localStorage: LocalUserData,
): number {
  const fromStorage = localStorage.GetValue(storageKey);

  if (typeof fromStorage === 'number') {
    return fromStorage;
  }

  const parsed = parseFloat(fromStorage);
  const value = !Number.isNaN(parsed) ? parsed : 1;

  // If we have gotten here, it means local storage is corrupt and needs to be updated.
  localStorage.SetValue(storageKey, value);
  return value;
}

export function useMasterVolume(): [number, (volume: number) => void] {
  const localStorage = useLocalStorage();

  const [masterVolume, setMasterVolume] = useState(
    safeVolumeValue('audio.volume.master', localStorage),
  );

  const soundController = useSoundController();

  // Ensure that the sound controller gets set to the correct volume on mount
  useEffect(() => {
    soundController.setMasterVolume(safeVolumeValue('audio.volume.master', localStorage));
  }, [soundController, localStorage]);

  const setVolume = useCallback(
    (volume: number) => {
      soundController.setMasterVolume(volume);
      localStorage.SetValue('audio.volume.master', volume);
      setMasterVolume(volume);
    },
    [soundController, localStorage],
  );

  return [masterVolume, setVolume];
}

export function useEffectsVolume(): [number, (volume: number) => void] {
  const localStorage = useLocalStorage();

  const [effectsVolume, setEffectsVolume] = useState(
    safeVolumeValue('audio.volume.effects', localStorage),
  );

  const soundController = useSoundController();

  // Ensure that the sound controller gets set to the correct volume on mount
  useEffect(() => {
    soundController.effectsVolume = safeVolumeValue('audio.volume.effects', localStorage);
  }, [soundController, localStorage]);

  const setVolume = useCallback(
    (volume: number) => {
      soundController.effectsVolume = volume;
      localStorage.SetValue('audio.volume.effects', volume);
      setEffectsVolume(volume);
    },
    [soundController, localStorage],
  );

  return [effectsVolume, setVolume];
}

export function useStreamVolume(): [number, (volume: number) => void] {
  const localStorage = useLocalStorage();

  const [streamVolume, setStreamVolume] = useState(
    safeVolumeValue('audio.volume.stream', localStorage),
  );

  const soundController = useSoundController();

  // Ensure that the sound controller gets set to the correct volume on mount
  useEffect(() => {
    soundController.streamVolume = safeVolumeValue('audio.volume.stream', localStorage);
  }, [soundController, localStorage]);

  const setVolume = useCallback(
    (volume: number) => {
      soundController.streamVolume = volume;
      localStorage.SetValue('audio.volume.stream', volume);
      setStreamVolume(volume);
    },
    [soundController, localStorage],
  );

  return [streamVolume, setVolume];
}

export function useMuteAudio(): [boolean, (muted: boolean) => void] {
  const localStorage = useLocalStorage();
  const [muted, setIsMuted] = useState(localStorage.GetValue('audio.muted'));

  const soundController = useSoundController();

  useEffect(() => {
    soundController.setMuted(localStorage.GetValue('audio.muted'));
  }, [soundController, localStorage]);

  // @todo: SetListener should be removed and replaced with a hook providing
  // initial local storage value and ui events (through UIEventHandler) for changes
  useEffect(() => {
    localStorage.SetListener('audio.muted', (muted) => setIsMuted(muted));
  }, [localStorage]);

  const setMuted = useCallback(
    (isMuted: boolean) => {
      soundController.setMuted(isMuted);
      localStorage.SetValue('audio.muted', isMuted);
      setIsMuted(isMuted);
    },
    [soundController, localStorage],
  );

  return [muted, setMuted];
}
