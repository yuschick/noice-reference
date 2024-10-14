import { TierResult, getGPUTier } from 'detect-gpu';

// @todo Remember that this is not the way to do things! We shouldn't cache some values to random variables, but it is the best choice here for now.
let gpuTier: TierResult | null = null;

export async function getTier(): Promise<TierResult | null> {
  if (!gpuTier) {
    gpuTier = await getGPUTier();
  }

  return gpuTier;
}
