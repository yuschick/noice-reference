#define MAX_BLENDSHAPES 10

uniform int activeBlendShapes;
uniform int blendShapeIndices[MAX_BLENDSHAPES];
uniform float blendShapeValues[MAX_BLENDSHAPES];
uniform sampler2D blendShapesMap;
uniform int blendShapesPerRow;

vec2 getOffset(int index, int blendShapesPerRow, float tileSize) {
    int row = index / blendShapesPerRow;
    int col = index - row * blendShapesPerRow;
    return vec2(float(col), float(row)) * tileSize;
}
