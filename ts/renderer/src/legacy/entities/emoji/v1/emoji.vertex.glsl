uniform float columns;
uniform float rows;

uniform vec2 index;

varying vec2 _uv;

void main()
{
  vec2 size = vec2(1.0 / columns, 1.0 / rows);

  vec2 offset = size * index * vec2(1.0, -1.0);
  vec2 newUv = uv * size;

  // Flip Y
  newUv.y = newUv.y + size.y * (rows  - 1.0);
  _uv = newUv + offset;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
