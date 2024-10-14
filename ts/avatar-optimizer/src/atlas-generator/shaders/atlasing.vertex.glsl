varying vec2 vUv;

void main() {
    vUv = uv;

    vec2 pos = uv3;
    pos = pos - vec2(0.5, 0.5); // center
    pos = pos * 2.0; // scale

    gl_Position = vec4(pos, 0.0, 1.0);
}
