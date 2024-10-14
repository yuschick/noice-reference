import { useCallback, useEffect, useRef } from 'react';

import { useDeepMemo } from './useDeepMemo.hook';

import { AudioTrack, AudioTrackTypes } from '@common-classes';
import { useSoundController } from '@common-context';
import { CommonSoundKeys, SoundConfig } from '@common-types';

type PlaySoundHook = [
  play: (fnOpts?: Partial<SoundConfig>) => number,
  stop: (soundId?: number) => void,
];

interface Options extends Partial<SoundConfig> {
  preserveOnUnmount?: boolean;
}

/**
 * Hook used for playing a given sound.
 *
 * @param sound The sound to play.
 * @param opts Optional sound configuration object.
 */
export function usePlaySound<
  Keys extends typeof CommonSoundKeys & { [index: string]: string },
  Key extends keyof Keys & string,
>(sound: Key, opts?: Options): PlaySoundHook {
  const { preserveOnUnmount, ...soundControllerOpts } = opts || {};

  const soundController = useSoundController();
  const activeSounds = useRef<number[]>([]);
  const memoSoundControllerOpts = useDeepMemo(soundControllerOpts);

  useEffect(() => {
    const track = soundController.getAudioTrack(AudioTrackTypes.Effects) as AudioTrack;
    // This will get called every time a sound finishes, but it will
    // essentially no-op if the sound wasnt started from here.
    const onSoundFinished = (soundId: number) => {
      activeSounds.current = [...activeSounds.current].filter((id) => id !== soundId);
    };
    track.addListener('sound-finished', onSoundFinished);
    return () => {
      track.removeListener('sound-finished', onSoundFinished);
    };
  }, [soundController]);

  /* Handle unmount cleanups */
  useEffect(() => {
    if (preserveOnUnmount) {
      return;
    }

    return () => {
      activeSounds.current.forEach((id) => soundController.stopSound(id));
    };
  }, [soundController, preserveOnUnmount, sound]);

  const playSound = useCallback(
    (fnOpts?: Partial<SoundConfig>) => {
      const id = soundController.playSound(sound, {
        ...memoSoundControllerOpts,
        ...fnOpts,
      });
      activeSounds.current.push(id);
      return id;
    },
    [sound, memoSoundControllerOpts, soundController],
  );

  const stopSound = useCallback(
    (id = -1) => {
      if (id === -1) {
        // Remove all if nothing is passed
        activeSounds.current.forEach((activeId) => soundController.stopSound(activeId));
        return;
      }

      // Otherwise just remove the one we were given.
      soundController.stopSound(id);
    },
    [soundController],
  );

  return [playSound, stopSound];
}
