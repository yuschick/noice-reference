import * as Comlink from 'comlink';
import { useEffect } from 'react';

import type { ArenaControllerType } from '../../types';
import { isOffscreenCanvasSupported } from '../../utils';
import { useMetricsPanel } from '../useMetricsPanel.hook';

import { useStreamSettings } from '@stream-context';

interface Props {
  arenaController: ArenaControllerType;
}

export function useFrameRenderStats({ arenaController }: Props) {
  const { metricsVisible } = useStreamSettings();
  const metricsCallback = useMetricsPanel(metricsVisible);
  const useWebWorker = isOffscreenCanvasSupported();

  useEffect(() => {
    arenaController?.setFrameRenderStatsCallback(
      useWebWorker && metricsCallback ? Comlink.proxy(metricsCallback) : metricsCallback,
    );
  }, [arenaController, useWebWorker, metricsCallback]);
}
