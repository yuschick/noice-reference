uniform vec3 tintColors[2];
uniform sampler2D tintMask;

vec3 overlayTint(vec3 a, vec3 b) {
	return mix(2.0 * a * b, 1.0 - 2.0 * (1.0 - a) * (1.0 - b), step(0.5, a));
}
