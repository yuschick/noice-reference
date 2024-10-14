import { UVUnwrapper } from 'xatlas-three';
import { ChartOptions, PackOptions } from 'xatlas-three/types';

enum ProgressMode {
  AddMesh = 0,
  ComputeCharts = 1,
  PackCharts = 2,
  BuildOutputMeshes = 3,
}

const PACKING_PROGRESS_MODE_COUNT = 3.0;

export async function loadUnwrapper(
  chartOptions: ChartOptions,
  packOptions: PackOptions,
  callback: (progress: number) => void,
): Promise<UVUnwrapper> {
  const unwrapper = new UVUnwrapper();

  unwrapper.chartOptions = chartOptions;
  unwrapper.packOptions = packOptions;

  unwrapper.useNormals = false;
  unwrapper.logProgress = true;

  await unwrapper.loadLibrary(
    (progressMode: ProgressMode, progress: number) => {
      // eslint-disable-next-line no-console
      // console.log(`PROGRESS mode ${ProgressMode[progressMode]} value ${progress}`);

      // xatlas pack charts progress stops to a random number above 50 so the progress never goes to 100,
      // assume greater than 50 is done :D
      if (progressMode === ProgressMode.PackCharts && progress > 50) {
        progress = 100.0;
      }

      const overallProgress =
        (progressMode + progress / 100.0) / (PACKING_PROGRESS_MODE_COUNT + 1);

      callback(overallProgress);
    },
    'https://cdn.jsdelivr.net/npm/xatlasjs@0.1.0/dist/xatlas.wasm',
    'https://cdn.jsdelivr.net/npm/xatlasjs@0.1.0/dist/xatlas.js',
  );

  return unwrapper;
}
