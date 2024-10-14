uniform sampler2D lut;
uniform vec3 parameters;

vec3 applyLUT(in vec3 color)
{
    color.b *= parameters.z;
    float shift = floor(color.b);

    color.rg = color.rg * parameters.z * parameters.xy + parameters.xy * 0.5;
    color.r += shift * parameters.y;

    color = mix(
        texture2D(lut, color.rg).rgb,
        texture2D(lut, color.rg + vec2(parameters.y, 0.0)).rgb,
        vec3(color.b - shift)
    );

    return color;
}
