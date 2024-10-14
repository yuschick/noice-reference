import { useAnalytics } from '@noice-com/common-ui';

import { GuideToMetaGameCard } from '../GuideToMetaGameCard/GuideToMetaGameCard';

import { Routes } from '@common/route';

export function GuideToDailyGoals() {
  const { trackEvent } = useAnalytics();

  const onClick = () => {
    trackEvent({
      clientButtonClick: { action: 'matchEndCtaDailygoals' },
    });
  };

  return (
    <GuideToMetaGameCard
      color="teal"
      subtitle={
        <>
          Go select your <br />
          Daily Goals!
        </>
      }
      title="Daily Goals available!"
      to={Routes.DailyGoals}
      showNewBadge
      onClick={onClick}
    />
  );
}
