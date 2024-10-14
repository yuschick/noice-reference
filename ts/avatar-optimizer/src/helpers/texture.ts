import * as THREE from 'three';

export function getTextureImageData(texture: THREE.Texture): ImageData | undefined {
  const canvas = document.createElement('canvas');
  canvas.width = texture.image.width;
  canvas.height = texture.image.height;

  const context = canvas.getContext('2d');
  context?.drawImage(texture.image, 0, 0);

  const data = context?.getImageData(0, 0, canvas.width, canvas.height);

  canvas.remove();

  return data;
}

export function sampleImageData(imageData: ImageData, uv: THREE.Vector2): THREE.Vector4 {
  const result = new THREE.Vector4();
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const x = Math.round(Math.max(Math.min(width - 1, uv.x * width), 0));
  const y = Math.round(Math.max(Math.min(height - 1, uv.y * height), 0));
  const startOffset = (y * width + x) * 4;

  result.x = data[startOffset];
  result.y = data[startOffset + 1];
  result.z = data[startOffset + 2];
  result.w = data[startOffset + 3];

  return result;
}
