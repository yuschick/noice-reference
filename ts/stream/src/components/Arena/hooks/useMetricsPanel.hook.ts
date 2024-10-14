import { Nullable, makeLoggers } from '@noice-com/utils';
import type {
  FrameStats,
  FrameStatsCallback,
} from '@noice-com/web-renderer/src/legacy/graphics/types';
import { useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line no-restricted-imports
import type { Stats } from '../types';

type StatPanels = {
  stats: Stats;
  matrixUpdatePanel: Stats.Panel;
  worldMatrixUpdatePanel: Stats.Panel;
  geometriesPanel: Stats.Panel;
  texturesPanel: Stats.Panel;
  frameTime: Stats.Panel;
};

const { logError } = makeLoggers('UseMetricsPanel');

export function useMetricsPanel(visible: boolean): Nullable<FrameStatsCallback> {
  const [panels, setPanels] = useState<Nullable<StatPanels>>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const promise = import('three/examples/jsm/libs/stats.module.js')
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .then(({ default: Stats }) => {
        const s = new Stats();
        document.body.appendChild(s.dom);

        // Remove invalid frametime panel
        s.dom.children[1].remove();

        setPanels({
          stats: s,
          frameTime: s.addPanel(new Stats.Panel('MS', '#f88', '#212')),
          matrixUpdatePanel: s.addPanel(new Stats.Panel('Matrix', '#ff8', '#221')),
          worldMatrixUpdatePanel: s.addPanel(
            new Stats.Panel('World Matrix', '#f8f', '#212'),
          ),
          geometriesPanel: s.addPanel(new Stats.Panel('Geometries', '#8f8', '#212')),
          texturesPanel: s.addPanel(new Stats.Panel('Textures', '#88f', '#212')),
        });
        s.showPanel(0);

        return () => {
          document.body.removeChild(s.dom);
        };
      });

    return () => {
      promise
        .then((destroy) => destroy())
        .catch((e) => logError('Failed to destroy AvatarPreview', e));
    };
  }, [visible]);

  const cb = useCallback(
    function (ev: FrameStats) {
      if (!panels) {
        return;
      }

      panels.stats.update();

      panels.matrixUpdatePanel.update(ev.matrixUpdates, 1000);
      panels.worldMatrixUpdatePanel.update(ev.worldMatrixUpdates, 1000);
      panels.geometriesPanel.update(ev.geometries, 500);
      panels.texturesPanel.update(ev.textures, 500);
      panels.frameTime.update(ev.frameTime, 20);
    },
    [panels],
  );

  if (!visible) {
    return null;
  }

  return cb;
}
