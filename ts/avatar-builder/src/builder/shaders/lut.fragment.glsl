#ifdef ATLASING_PASS
diffuseColor.rgb = sRGBToLinear(diffuseColor.rgb);
#endif

diffuseColor.rgb = applyLUT(diffuseColor.rgb);

#ifdef ATLASING_PASS
diffuseColor.rgb = LinearTosRGB(diffuseColor.rgb);
#endif
