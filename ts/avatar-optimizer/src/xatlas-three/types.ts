export interface ChartOptions {
  // Number of iterations of the chart growing and seeding phases. Higher values result in better charts.
  maxIterations?: number;

  straightnessWeight?: number;

  textureSeamWeight?: number;

  // Use MeshDecl::vertexUvData for charts.
  useInputMeshUvs?: boolean;

  // Don't grow charts to be larger than this. 0 means no limit.
  // Weights determine chart growth. Higher weights mean higher cost for that metric.
  maxChartArea?: number;

  normalDeviationWeight?: number;

  // If total of all metrics * weights > maxCost, don't grow chart. Lower values result in more charts.
  maxCost?: number;

  roundnessWeight?: number;

  // Don't grow charts to have a longer boundary than this. 0 means no limit.
  maxBoundaryLength?: number;

  // If > 1000, normal seams are fully respected.
  normalSeamWeight?: number;

  // Enforce consistent texture coordinate winding.
  fixWinding?: boolean;
}

export interface PackOptions {
  // Charts larger than this will be scaled down. 0 means no limit.
  maxChartSize?: number;

  // Number of pixels to pad charts with.
  padding?: number;

  // Leave space around charts for texels that would be sampled by bilinear filtering.
  bilinear?: boolean;

  // Create Atlas::image
  createImage?: boolean;

  // Rotate charts to improve packing.
  rotateCharts?: boolean;

  // Rotate charts to the axis of their convex hull.
  rotateChartsToAxis?: boolean;

  // Align charts to 4x4 blocks. Also improves packing speed, since there are fewer possible chart locations to consider.
  blockAlign?: boolean;

  // If 0, generate a single atlas with texelsPerUnit determining the final resolution.
  // If not 0, and texelsPerUnit is not 0, generate one or more atlases with that exact resolution.
  // If not 0, and texelsPerUnit is 0, texelsPerUnit is estimated to approximately match the resolution.
  resolution?: number;

  // Slower, but gives the best result. If false, use random chart placement.
  bruteForce?: boolean;

  // Unit to texel scale. e.g. a 1x1 quad with texelsPerUnit of 32 will take up approximately 32x32 texels in the atlas.
  // If 0, an estimated value will be calculated to approximately match the given resolution.
  // If resolution is also 0, the estimated value will approximately match a 1024x1024 atlas.
  texelsPerUnit?: number;
}
