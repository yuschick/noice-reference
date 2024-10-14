import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';

import COLORSPACE_UTILITIES_GLSL from '../builder/shaders/colorspace-utilities.glsl';
import LUT_PARS_FRAGMENT_GLSL from '../builder/shaders/lut-pars.fragment.glsl';
import LUT_FRAGMENT_GLSL from '../builder/shaders/lut.fragment.glsl';
import MASKED_TINT_PARS_FRAGMENT_GLSL from '../builder/shaders/masked-tint-pars.fragment.glsl';
import MASKED_TINT_FRAGMENT_GLSL from '../builder/shaders/masked-tint.fragment.glsl';
import TINT_PARS_FRAGMENT_GLSL from '../builder/shaders/tint-pars.fragment.glsl';
import TINT_FRAGMENT_GLSL from '../builder/shaders/tint.fragment.glsl';

export function injectParsAndFragmentToThreeShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  pars: string,
  fragment: string,
) {
  if (shader.fragmentShader.indexOf(pars) < 0) {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_pars_fragment>',
      `#include <map_pars_fragment>\n${pars}`,
    );
  }

  if (shader.fragmentShader.indexOf(fragment) < 0) {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>\n${fragment}`,
    );
  }
}

export function injectParsAndVertexToThreeShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  pars: string,
  vertex: string,
) {
  if (shader.vertexShader.indexOf(pars) < 0) {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <clipping_planes_pars_vertex>',
      `#include <clipping_planes_pars_vertex>\n${pars}`,
    );
  }

  if (shader.vertexShader.indexOf(vertex) < 0) {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\n${vertex}`,
    );
  }
}

export function injectParsAndFragmentToRawShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  pars: string,
  fragment: string,
) {
  if (shader.fragmentShader.indexOf(pars) < 0) {
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main()',
      `${pars}\nvoid main()`,
    );
  }

  if (shader.fragmentShader.indexOf(fragment) < 0) {
    shader.fragmentShader = shader.fragmentShader.replace(
      'gl_FragColor',
      `${fragment}\ngl_FragColor`,
    );
  }
}

export enum ShaderInjectionTarget {
  ThreeShader = 1,
  RawShader,
}

export function injectTintShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  injectionTarget: ShaderInjectionTarget,
  color: THREE.Color = new THREE.Color(1.0, 1.0, 1.0),
) {
  if (injectionTarget === ShaderInjectionTarget.RawShader) {
    injectParsAndFragmentToRawShader(
      shader,
      COLORSPACE_UTILITIES_GLSL + TINT_PARS_FRAGMENT_GLSL,
      TINT_FRAGMENT_GLSL,
    );
  } else {
    injectParsAndFragmentToThreeShader(
      shader,
      TINT_PARS_FRAGMENT_GLSL,
      TINT_FRAGMENT_GLSL,
    );
  }

  updateTintShader(shader, color);
}

export function updateTintShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  color: THREE.Color = new THREE.Color(1.0, 1.0, 1.0),
) {
  shader.uniforms.tintColor = {
    value: color.convertSRGBToLinear(),
  };
}

export function injectMaskedTintShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  injectionTarget: ShaderInjectionTarget,
  colors: THREE.Color[] = [
    new THREE.Color(1.0, 1.0, 1.0),
    new THREE.Color(1.0, 1.0, 1.0),
  ],
  maskTexture: Nullable<THREE.Texture> = null,
) {
  if (injectionTarget === ShaderInjectionTarget.RawShader) {
    injectParsAndFragmentToRawShader(
      shader,
      COLORSPACE_UTILITIES_GLSL + MASKED_TINT_PARS_FRAGMENT_GLSL,
      MASKED_TINT_FRAGMENT_GLSL,
    );
  } else {
    injectParsAndFragmentToThreeShader(
      shader,
      MASKED_TINT_PARS_FRAGMENT_GLSL,
      MASKED_TINT_FRAGMENT_GLSL,
    );
  }

  updateMaskedTintShader(shader, colors, maskTexture);
}

export function updateMaskedTintShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  colors: THREE.Color[] = [
    new THREE.Color(1.0, 1.0, 1.0),
    new THREE.Color(1.0, 1.0, 1.0),
  ],
  maskTexture: Nullable<THREE.Texture> = null,
) {
  const linearColors: THREE.Color[] = [];

  for (const color of colors) {
    linearColors.push(color.convertSRGBToLinear());
  }

  shader.uniforms.tintColors = {
    value: linearColors,
  };
  shader.uniforms.tintMask = { value: maskTexture };
}

export function injectSkinColorLUTShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  injectionTarget: ShaderInjectionTarget,
  texture: Nullable<THREE.Texture> = null,
) {
  if (injectionTarget === ShaderInjectionTarget.RawShader) {
    injectParsAndFragmentToRawShader(
      shader,
      COLORSPACE_UTILITIES_GLSL + LUT_PARS_FRAGMENT_GLSL,
      LUT_FRAGMENT_GLSL,
    );
  } else {
    injectParsAndFragmentToThreeShader(shader, LUT_PARS_FRAGMENT_GLSL, LUT_FRAGMENT_GLSL);
  }

  updateSkinColorLUTShader(shader, texture);
}

export function updateSkinColorLUTShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  texture: Nullable<THREE.Texture> = null,
) {
  let parameters: THREE.Vector3;

  if (texture !== null) {
    parameters = new THREE.Vector3(
      1.0 / texture.image.width,
      1.0 / texture.image.height,
      texture.image.height - 1,
    );
  } else {
    parameters = new THREE.Vector3();
  }

  shader.uniforms.lut = { value: texture };
  shader.uniforms.parameters = { value: parameters };
}

export interface ShaderExtension {
  injector: (shader: THREE.WebGLProgramParametersWithUniforms) => void;
  shader?: THREE.WebGLProgramParametersWithUniforms;
}

export function addShaderExtension(
  material: THREE.Material,
  name: string,
  extension: ShaderExtension,
) {
  if (!material.userData.shaderExtensions) {
    material.userData.shaderExtensions = {} as { [name: string]: ShaderExtension };
  }

  if (!material.userData.initialCacheKey) {
    material.userData.initialCacheKey = material.customProgramCacheKey();
  }

  material.userData.shaderExtensions[name] = extension;

  material.onBeforeCompile = (shader) => {
    if (!material.userData.shaderExtensions) {
      return;
    }

    for (const name in material.userData.shaderExtensions) {
      const extension = material.userData.shaderExtensions[name] as ShaderExtension;
      extension?.injector(shader);
    }

    material.userData.extendedShader = shader;
  };

  material.customProgramCacheKey = () => {
    return Object.keys(material.userData.shaderExtensions)?.length
      ? Object.keys(material.userData.shaderExtensions).join('-')
      : material.userData.initialCacheKey;
  };
}

export function removeShaderExtension(material: THREE.Material, name: string) {
  delete material.userData.extendedShader[name];
}

export function getExtendedShader(
  material: THREE.Material,
): THREE.WebGLProgramParametersWithUniforms {
  return material?.userData?.extendedShader;
}
