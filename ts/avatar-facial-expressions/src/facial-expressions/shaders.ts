import { injectParsAndVertexToThreeShader } from '@noice-com/avatar-builder/src/helpers';
import * as THREE from 'three';

import BLENDSHAPES_PARS_VERTEX_GLSL from './shaders/blendshapes-pars.vertex.glsl';
import BLENDSHAPES_VERTEX_GLSL from './shaders/blendshapes.vertex.glsl';

export function injectBlendShapesShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  blendShapesMap: THREE.Texture | null = null,
  blendShapeIndices: number[] = new Array(10).fill(0),
  blendShapeValues: number[] = new Array(10).fill(0),
  activeBlendShapes = 0,
  blendShapesPerRow = 7,
) {
  injectParsAndVertexToThreeShader(
    shader,
    BLENDSHAPES_PARS_VERTEX_GLSL,
    BLENDSHAPES_VERTEX_GLSL,
  );
  updateBlendShapesShader(
    shader,
    blendShapesMap,
    blendShapeIndices,
    blendShapeValues,
    activeBlendShapes,
    blendShapesPerRow,
  );
}

export function updateBlendShapesShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  blendShapesMap: THREE.Texture | null = null,
  blendShapeIndices: number[],
  blendShapeValues: number[],
  activeBlendShapes: number,
  blendShapesPerRow = 7,
) {
  shader.uniforms.activeBlendShapes = { value: activeBlendShapes };
  shader.uniforms.blendShapesMap = { value: blendShapesMap };
  shader.uniforms.blendShapeIndices = { value: blendShapeIndices };
  shader.uniforms.blendShapeValues = { value: blendShapeValues };
  shader.uniforms.blendShapesPerRow = { value: blendShapesPerRow };
}
