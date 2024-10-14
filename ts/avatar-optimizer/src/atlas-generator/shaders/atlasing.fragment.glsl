varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
    vec4 diffuseColor = texture2D(uTexture, vUv);
    gl_FragColor = diffuseColor;
}
