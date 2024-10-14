import { useAnalytics } from '@noice-com/common-ui';

import { GuideToMetaGameCard } from '../GuideToMetaGameCard/GuideToMetaGameCard';

import { Routes } from '@common/route';

export function GuideToCompletedDailyGoals() {
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
          Go collect
          <br /> your reward!
        </>
      }
      title="Daily Goal Completed!"
      to={Routes.DailyGoals}
      onClick={onClick}
    />
  );
}
