import { FontSize, WithChildren } from '@noice-com/common-ui';
import { createContext, useState } from 'react';

import { CountDisplayType } from './types';

import { useStudioLocalStorage } from '@common/local-storage';

interface AudienceInsightsSettingsResult {
  countDisplayType: CountDisplayType;
  fontSize: FontSize;
  setCountDisplayType: (countDisplayType: CountDisplayType) => void;
  setFontSize: (fontSize: FontSize) => void;
}

export const AudienceInsightsSettingsContext = createContext<
  AudienceInsightsSettingsResult | undefined
>(undefined);

const AudienceInsightsSettingsProvider = ({ children }: WithChildren) => {
  const localStorage = useStudioLocalStorage();

  const [countDisplayType, setCountDisplayType] = useState<CountDisplayType>(
    localStorage?.GetValue('audienceInsights.countDisplayType') || 'percentage',
  );

  const [fontSize, setFontSize] = useState<FontSize>(
    localStorage?.GetValue('audienceInsights.fontSize') || 'small',
  );

  const handleSetCountDisplayType = (type: CountDisplayType) => {
    setCountDisplayType(type);
    localStorage?.SetValue('audienceInsights.countDisplayType', type);
  };

  const handleSetFontSize = (fontSize: FontSize) => {
    setFontSize(fontSize);
    localStorage?.SetValue('audienceInsights.fontSize', fontSize);
  };

  return (
    <AudienceInsightsSettingsContext.Provider
      value={{
        countDisplayType,
        fontSize,
        setCountDisplayType: handleSetCountDisplayType,
        setFontSize: handleSetFontSize,
      }}
    >
      {children}
    </AudienceInsightsSettingsContext.Provider>
  );
};

export { AudienceInsightsSettingsProvider };
