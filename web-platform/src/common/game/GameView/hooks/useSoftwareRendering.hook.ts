import { useConditionalOnce } from '@noice-com/common-react-core';
import { GPU } from '@noice-com/stream';
import { useState } from 'react';

interface HookResult {
  loading: boolean;
  isSoftwareRendering: boolean;
}

export function useSoftwareRendering(): HookResult {
  const [isSoftwareRendering, setIsSoftwareRendering] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useConditionalOnce(() => {
    const checkGpu = async () => {
      const gpuTier = await GPU.getTier();
      setIsSoftwareRendering(gpuTier?.gpu?.includes('SwiftShader') ?? false);
      setLoading(false);
    };

    checkGpu();
  }, loading);

  return {
    loading,
    isSoftwareRendering,
  };
}
