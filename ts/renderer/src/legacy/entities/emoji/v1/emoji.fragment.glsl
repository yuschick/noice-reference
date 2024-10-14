uniform sampler2D source;

varying vec2 _uv;

void main()
{
  gl_FragColor = texture(source, _uv);
}
