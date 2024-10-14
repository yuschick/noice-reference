const FullscreenStreamShader = {
  name: 'FullscreenStreamShader',

  uniforms: {
    tStream: { value: null },
    textureParams: { value: null },
    drawingBufferParams: { value: null },
  },

  vertexShader: /* glsl */ `
    uniform mat3 transformationMatrix;
    uniform vec4 textureParams;
    uniform vec4 drawingBufferParams;
    
    varying vec2 vUv;

    void main() {
      // vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      float factorX = (textureParams.x * drawingBufferParams.y) / (drawingBufferParams.x * textureParams.y);
      float factorY = (textureParams.y * drawingBufferParams.x) / (drawingBufferParams.y * textureParams.x);
      float sign = sign(drawingBufferParams.z - textureParams.z);

      float uvx = mix(uv.x, (((uv.x * 2. - 1.) / factorX) + 1.) * 0.5, clamp(sign, 0., 1.));
      float uvy = mix(uv.y, (((uv.y * 2. - 1.) / factorY) + 1.) * 0.5, clamp(-sign, 0., 1.));
      vUv = vec2(uvx, uvy);
    }`,

  fragmentShader: /* glsl */ `
    uniform sampler2D tStream;

    varying vec2 vUv;

    vec3 decode(vec3 rgb)
    {
      vec3 a = rgb / 12.92;
      vec3 b = pow((rgb + 0.055) / 1.055, vec3(2.4));
      vec3 c = step(vec3(0.04045), rgb);

      return mix(a, b, c);
    }

    void main() {
      if (any(lessThan(vUv, vec2(0.0))) == true || any(greaterThan(vUv, vec2(1.0))) == true)
          discard;
      
      vec4 stream = texture2D( tStream, vUv );
      gl_FragColor = vec4(stream.rgb, 1.);
    }`,
};

export { FullscreenStreamShader };
