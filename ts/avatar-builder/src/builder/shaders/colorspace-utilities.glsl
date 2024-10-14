vec3 sRGBToLinear(vec3 value) {
    return mix(value / 12.92, pow((value + 0.055) / 1.055, vec3(2.4)), step(0.04045, value));
}

vec3 LinearTosRGB(vec3 value) {
    return mix(12.92 * value, 1.055 * pow(value, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, value));
}
