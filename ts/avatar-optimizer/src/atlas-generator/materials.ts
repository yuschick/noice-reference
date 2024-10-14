import * as THREE from 'three';

import ATLASING_FRAGMENT_GLSL from './shaders/atlasing.fragment.glsl';
import ATLASING_VERTEX_GLSL from './shaders/atlasing.vertex.glsl';
import DILATION_FRAGMENT_GLSL from './shaders/dilation.fragment.glsl';
import DILATION_VERTEX_GLSL from './shaders/dilation.vertex.glsl';

export function createAtlasMaterial(texture: THREE.Texture): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    vertexShader: ATLASING_VERTEX_GLSL,
    fragmentShader: ATLASING_FRAGMENT_GLSL,
    uniforms: {
      uTexture: {
        value: texture,
      },
    },
    defines: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ATLASING_PASS: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      USE_UV3: true,
    },
  });

  material.side = THREE.DoubleSide;
  material.toneMapped = false;
  material.transparent = false;
  material.precision = 'highp';
  material.depthTest = false;
  material.depthWrite = false;
  material.forceSinglePass = true;
  material.premultipliedAlpha = false;
  material.dithering = false;
  material.colorWrite = true;
  material.stencilWrite = false;
  material.needsUpdate = true;

  return material;
}

export function createDilationMaterial(
  texture: THREE.Texture,
  pixelOffset: THREE.Vector2,
): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    vertexShader: DILATION_VERTEX_GLSL,
    fragmentShader: DILATION_FRAGMENT_GLSL,
    uniforms: {
      uTexture: {
        value: texture,
      },
      pixelOffset: { value: pixelOffset },
    },
  });

  material.side = THREE.FrontSide;
  material.toneMapped = false;
  material.transparent = false;
  material.precision = 'highp';
  material.depthTest = false;
  material.depthWrite = false;
  material.forceSinglePass = true;
  material.premultipliedAlpha = false;
  material.dithering = false;
  material.colorWrite = true;
  material.stencilWrite = false;
  material.needsUpdate = true;

  return material;
}
