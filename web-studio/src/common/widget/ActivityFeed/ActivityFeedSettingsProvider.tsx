import { FontSize, WithChildren } from '@noice-com/common-ui';
import { createContext, useState } from 'react';

import { useStudioLocalStorage } from '@common/local-storage';

export type TimestampFormat = 'absolute' | 'relative';
export type Direction = 'top' | 'bottom';

interface ActivityFeedSettingsResult {
  direction: Direction;
  fontSize: FontSize;
  showAvatars: boolean;
  showUserBadges: boolean;
  timestampFormat: TimestampFormat;
  setDirection: (direction: Direction) => void;
  setFontSize: (fontSize: FontSize) => void;
  setShowAvatars: (show: boolean) => void;
  setShowUserBadges: (show: boolean) => void;
  setTimestampFormat: (timestamp: TimestampFormat) => void;
}

export const ActivityFeedSettingsContext = createContext<
  ActivityFeedSettingsResult | undefined
>(undefined);

const ActivityFeedSettingsProvider = ({ children }: WithChildren) => {
  const localStorage = useStudioLocalStorage();

  const [fontSize, setFontSize] = useState<FontSize>(
    localStorage?.GetValue('activityFeed.fontSize') || 'small',
  );
  const [showAvatars, setShowAvatars] = useState<boolean>(
    localStorage?.GetValue('activityFeed.showAvatars') ?? true,
  );
  const [showUserBadges, setShowUserBadges] = useState<boolean>(
    localStorage?.GetValue('activityFeed.showUserBadges') ?? true,
  );
  const [timestampFormat, setTimestampFormat] = useState<TimestampFormat>(
    localStorage?.GetValue('activityFeed.timestampFormat') || 'relative',
  );
  const [direction, setDirection] = useState<Direction>(
    localStorage?.GetValue('activityFeed.direction') || 'top',
  );

  const handleSetFontSize = (fontSize: FontSize) => {
    setFontSize(fontSize);
    localStorage?.SetValue('activityFeed.fontSize', fontSize);
  };

  const handleSetShowAvatars = (show: boolean) => {
    setShowAvatars(show);
    localStorage?.SetValue('activityFeed.showAvatars', show);
  };

  const handleSetShowUserBadges = (show: boolean) => {
    setShowUserBadges(show);
    localStorage?.SetValue('activityFeed.showUserBadges', show);
  };

  const handleSetTimestampFormat = (timestamp: TimestampFormat) => {
    setTimestampFormat(timestamp);
    localStorage?.SetValue('activityFeed.timestampFormat', timestamp);
  };

  const handleSetDirection = (direction: Direction) => {
    setDirection(direction);
    localStorage?.SetValue('activityFeed.direction', direction);
  };

  return (
    <ActivityFeedSettingsContext.Provider
      value={{
        direction,
        fontSize,
        setDirection: handleSetDirection,
        setFontSize: handleSetFontSize,
        setShowAvatars: handleSetShowAvatars,
        setShowUserBadges: handleSetShowUserBadges,
        setTimestampFormat: handleSetTimestampFormat,
        showAvatars,
        showUserBadges,
        timestampFormat,
      }}
    >
      {children}
    </ActivityFeedSettingsContext.Provider>
  );
};

export { ActivityFeedSettingsProvider };
