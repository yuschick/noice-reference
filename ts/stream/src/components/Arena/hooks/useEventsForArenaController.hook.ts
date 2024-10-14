import { ArenaControllerType } from '../types';

import { useContentMode } from './controller/useContentMode.hook';
import { useExpressionEvents } from './controller/useExpressionEvents.hook';
import { useFrameRenderStats } from './controller/useFrameRenderStats.hook';
import { useGamePlayEvents } from './controller/useGamePlayEvents.hook';
import { useLoadArenaEvent } from './controller/useLoadArenaEvent.hook';
import { useMatchStateEvents } from './controller/useMatchStateEvents.hook';
import { usePlayerListEvents } from './controller/usePlayerListEvents.hook';
import { useRenderQualitySettings } from './controller/useRenderQualitySettings.hook';

import { StreamEventEmitter } from '@stream-classes';
import { StreamProps } from '@stream-types';

interface Props {
  arenaController: ArenaControllerType;
  streamProps: StreamProps;
  eventEmitter: StreamEventEmitter;
}

export function useEventsForArenaController({
  arenaController,
  streamProps,
  eventEmitter,
}: Props) {
  useContentMode({ arenaController, streamProps });
  useExpressionEvents({ arenaController, eventEmitter });
  useGamePlayEvents({ arenaController, eventEmitter });
  useLoadArenaEvent({ arenaController, streamProps });
  useMatchStateEvents({ arenaController });
  usePlayerListEvents({ arenaController, streamProps });
  useFrameRenderStats({ arenaController });
  useRenderQualitySettings({ arenaController });
}
