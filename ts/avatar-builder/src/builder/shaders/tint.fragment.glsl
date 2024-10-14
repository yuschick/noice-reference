#ifdef ATLASING_PASS
diffuseColor.rgb = sRGBToLinear(diffuseColor.rgb);
#endif

diffuseColor.rgb *= tintColor;

#ifdef ATLASING_PASS
diffuseColor.rgb = LinearTosRGB(diffuseColor.rgb);
#endif
