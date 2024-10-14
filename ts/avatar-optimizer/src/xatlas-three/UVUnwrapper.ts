/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';

import { ChartOptions, PackOptions } from './types';
import { XAtlasWebWorker } from './XAtlasWebWorker';

const { logInfoVerbose, logWarn } = makeLoggers('xatlas-three');

export interface PackResult {
  uuid: string;
  newVertexCount: number;
  newIndices: Uint16Array;
  newUvs: Float32Array;
  oldIndices: Uint16Array;
}

export class UVUnwrapper {
  private _xAtlas: XAtlasWebWorker;
  private _libraryLoaded = false;
  private _isUnwrapping = false;

  constructor(
    public packOptions: PackOptions = {
      resolution: 2048,
    },
    public chartOptions: ChartOptions = {},
    public useNormals: boolean = false,
    public logProgress: boolean = false,
  ) {
    this._xAtlas = new XAtlasWebWorker();
  }

  public async loadLibrary(
    onProgress: (mode: any, progress: any) => void,
    wasmFilePath: string,
    workerFilePath?: string,
  ): Promise<void> {
    if (this._libraryLoaded) {
      return;
    }
    await new Promise<void>((resolve, reject) => {
      try {
        this._xAtlas.init(
          () => {
            resolve();
          },
          onProgress,
          wasmFilePath,
          workerFilePath,
        );
      } catch (e) {
        reject(e);
      }
    });
    while (!(this._xAtlas.api ? await this._xAtlas.api.loaded : false)) {
      // eslint-disable-next-line promise/param-names
      await new Promise((r) => setTimeout(r, 100)); // wait for load just in case
    }
    this._libraryLoaded = true;
  }

  public async packAtlas(geometries: THREE.BufferGeometry[]): Promise<PackResult[]> {
    if (!this._libraryLoaded) {
      logWarn('Library not loaded');
      return [];
    }

    if (!geometries || geometries.length < 1) {
      return [];
    }

    const useUvs = this.chartOptions.useInputMeshUvs;

    while (this._isUnwrapping) {
      logInfoVerbose('Unwrapping another mesh, waiting 100 ms');
      // eslint-disable-next-line promise/param-names
      await new Promise((r) => setTimeout(r, 100));
    }

    this._isUnwrapping = true;

    await this._xAtlas.api.setProgressLogging(this.logProgress);
    await this._xAtlas.api.createAtlas();

    for (const mesh of geometries) {
      const { uuid, index, attributes } = mesh;

      if (
        attributes.position instanceof THREE.GLBufferAttribute ||
        attributes.uv instanceof THREE.GLBufferAttribute ||
        attributes.normal instanceof THREE.GLBufferAttribute
      ) {
        logWarn(`Attribute type in mesh ${mesh} not supported`);
        continue;
      }

      if (
        !index ||
        !attributes.position ||
        attributes.position?.itemSize !== 3 ||
        !attributes.uv ||
        attributes.uv?.itemSize !== 2
      ) {
        logWarn(`Mesh ${mesh} not supported`);
        continue;
      }

      await this._xAtlas.api.addMesh(
        index.array,
        attributes.position.array,
        attributes.normal ? attributes.normal.array : undefined,
        attributes.uv ? attributes.uv.array : undefined,
        uuid,
        this.useNormals,
        useUvs,
        1,
      );
    }

    const meshes = await this._xAtlas.api.generateAtlas(
      this.chartOptions,
      this.packOptions,
      true,
    );

    const result: PackResult[] = [];

    for (const m of meshes) {
      const mesh = geometries.find((n) => n.uuid === m.mesh);
      if (!mesh) {
        logWarn(`Mesh ${m.mesh} not found`);
        continue;
      }

      result.push({
        uuid: m.mesh,
        newVertexCount: m.vertexCount,
        newIndices: m.index,
        newUvs: m.vertex.coords1,
        oldIndices: m.oldIndexes,
      });
    }

    await this._xAtlas.api.destroyAtlas();

    this._isUnwrapping = false;

    return result;
  }
}
