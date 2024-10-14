import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import {
  StreamQualitySettings,
  useStreamQualitySettings,
} from '../hooks/useStreamQualitySettings.hook';
import {
  StreamRenderSettings,
  useStreamRenderSettings,
} from '../hooks/useStreamRenderSettings.hook';

interface StreamSettings extends StreamRenderSettings, StreamQualitySettings {}

const StreamSettingsContext = createContext<Nullable<StreamSettings>>(null);

export function StreamSettingsProvider({ children }: WithChildren) {
  const streamRenderSetings = useStreamRenderSettings();
  const streamQualitySettings = useStreamQualitySettings();

  return (
    <StreamSettingsContext.Provider
      value={{
        ...streamRenderSetings,
        ...streamQualitySettings,
      }}
    >
      {children}
    </StreamSettingsContext.Provider>
  );
}

export function useStreamSettings() {
  const context = useContext(StreamSettingsContext);

  if (!context) {
    throw new Error(
      'Trying to access LiveViewSettingsContext from context without LiveViewSettingProvider',
    );
  }

  return context;
}
