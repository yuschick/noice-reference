vec2 pos = uv2;
float tileWidth = 1.0 / float(blendShapesPerRow);

pos.y = 1.0 - pos.y;
pos *= tileWidth;

for (int i = 0; i < activeBlendShapes; ++i) {
    vec2 uv = pos + getOffset(blendShapeIndices[i], blendShapesPerRow, tileWidth);
    vec3 displacement = mix(vec3(0), texture2D(blendShapesMap, uv).xyz, blendShapeValues[i]);
    transformed += displacement;
}
