/* eslint-disable react-hooks/rules-of-hooks */
// eslint-disable-next-line no-restricted-imports
import Loop from '@noice-com/assets-core/src/audio/loop.mp3';
// eslint-disable-next-line no-restricted-imports
import RankUp from '@noice-com/assets-core/src/audio/ui_player_rank_up.mp3';
import { Nullable } from '@noice-com/utils';
import { StoryObj } from '@storybook/react';
import { Howl } from 'howler';
import { useEffect, useState } from 'react';

import { AudioTrack } from '@common-classes';
import { Button } from '@common-components';
import { SoundAsset } from '@common-types';

export default {
  title: 'Audio Tracks',
  argTypes: {
    volume: {
      name: 'Volume',
      control: {
        type: 'number',
        min: 1,
        max: 0,
        step: 0.1,
      },
    },
    mute: {
      name: 'Mute',
      control: {
        type: 'boolean',
      },
    },
  },
};

const TRACK = new AudioTrack('Example');
const SoundLoop: SoundAsset = {
  instance: new Howl({
    src: [Loop],
    volume: 0.75,
    loop: true,
  }),
  soundKey: 'loop',
  defaultConfig: {
    volume: 0.75,
    loop: true,
  },
};
const SoundLong: SoundAsset = {
  instance: new Howl({
    src: [RankUp],
    volume: 1,
  }),
  soundKey: 'long',
  defaultConfig: {
    volume: 1,
  },
};

interface Props {
  volume: number;
  mute: boolean;
}

export const Player: StoryObj<Props> = {
  render: ({ volume, mute }: Props) => {
    const [loopId, setLoopId] = useState<Nullable<number>>(null);

    const toggleLoop = () => {
      if (loopId === null) {
        const id = TRACK.playSound<SoundAsset>(SoundLoop);
        setLoopId(id);
      } else {
        TRACK.stopSound(loopId);
        setLoopId(null);
      }
    };

    useEffect(() => {
      if (TRACK.volume !== volume) {
        TRACK.volume = volume;
      }

      if (TRACK.muted !== mute) {
        TRACK.muted = mute;
      }
    }, [volume, mute]);

    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)._TRACK_ = TRACK;

      return () => {
        TRACK.stopAll();
      };
    }, []);

    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        <Button
          size="lg"
          onClick={() => TRACK.playSound(SoundLong)}
        >
          Play long sound
        </Button>
        <Button
          size="lg"
          onClick={() => TRACK.playSound(SoundLong, { priority: true })}
        >
          Play long sound (with ducking)
        </Button>
        <Button
          size="lg"
          onClick={() => TRACK.playSound(SoundLong, { delay: 500 })}
        >
          Play long sound (with delay)
        </Button>
        <Button
          size="lg"
          onClick={() => TRACK.playSound(SoundLong, { range: [0.015, 0.9] })}
        >
          Play long sound (with range)
        </Button>
        <Button
          size="lg"
          variant={loopId !== null ? 'solid' : 'cta'}
          onClick={toggleLoop}
        >
          {loopId !== null ? 'Stop loop' : 'Play loop'}
        </Button>
      </div>
    );
  },

  args: {
    volume: 1,
  },
};
