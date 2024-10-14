import { useFeatureFlag } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { isClientSideRenderingSupported } from '../components/Arena/utils';

function useClientSideRenderingSupported() {
  const [clientSideRenderingSupported, setClientSideRenderingSupported] =
    useState<Nullable<boolean>>(null);
  useEffect(() => {
    const getClientSideRendering = async () => {
      const supportsClientSideRendering = await isClientSideRenderingSupported();
      setClientSideRenderingSupported(supportsClientSideRendering);
    };

    getClientSideRendering();
  }, []);

  return [clientSideRenderingSupported, useClientSideRenderingSupported === null];
}

export enum ClientSideRendering {
  Disabled = 'disabled',
  Enabled = 'enabled',
  Fallback = 'fallback',
}

export function useClientSideRenderingEnabled() {
  const [clientSideRendering, clientSideRenderingLoading] = useFeatureFlag(
    'clientSideRendering',
    'disabled',
  );
  const [clientSideRenderingSupported, clientSideRenderingSupportedLoading] =
    useClientSideRenderingSupported();

  if (clientSideRenderingSupportedLoading || clientSideRenderingLoading) {
    return [ClientSideRendering.Disabled, true];
  }

  if (clientSideRendering === 'disabled') {
    return [ClientSideRendering.Disabled, false];
  } else if (clientSideRendering === 'forced') {
    return [ClientSideRendering.Enabled, false];
  } else if (clientSideRendering === 'fallback') {
    return [ClientSideRendering.Fallback, false];
  } else {
    return [
      clientSideRenderingSupported
        ? ClientSideRendering.Enabled
        : ClientSideRendering.Disabled,
      false,
    ];
  }
}
