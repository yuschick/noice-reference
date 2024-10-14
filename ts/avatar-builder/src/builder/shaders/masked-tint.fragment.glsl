#ifdef ATLASING_PASS
diffuseColor.rgb = sRGBToLinear(diffuseColor.rgb);
#endif

vec3 layer1 = overlayTint(diffuseColor.rgb, tintColors[0]);
vec3 layer2 = overlayTint(diffuseColor.rgb, tintColors[1]);

vec4 tintMask = texture2D(tintMask, vUv);

diffuseColor.rgb = mix(diffuseColor.rgb, layer1, tintMask.r);
diffuseColor.rgb = mix(diffuseColor.rgb, layer2, tintMask.g);

#ifdef ATLASING_PASS
diffuseColor.rgb = LinearTosRGB(diffuseColor.rgb);
#endif
