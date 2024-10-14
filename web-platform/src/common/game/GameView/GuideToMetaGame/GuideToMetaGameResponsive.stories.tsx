import { Button } from '@noice-com/common-ui';
import { StoryFn } from '@storybook/react';

import { GuideToAds } from './components/GuideToAds/GuideToAds';
import { GuideToBuyPremiumBundles } from './components/GuideToBuyPremiumBundles/GuideToBuyPremiumBundles';
import { GuideToBuyStandardBundles } from './components/GuideToBuyStandardBundles/GuideToBuyStandardBundles';
import { GuideToCompletedDailyGoals } from './components/GuideToCompletedDailyGoals/GuideToCompletedDailyGoals';
import { GuideToDailyGoals } from './components/GuideToDailyGoals/GuideToDailyGoals';
import { GuideToMetaGame } from './GuideToMetaGame';
import styles from './GuideToMetaGame.module.css';

export default {
  title: 'Guide To Meta Game/Responsive Test',
  component: GuideToMetaGame,
};

const Template: StoryFn = ({ ...args }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.cards}>
        <GuideToAds
          rewardAmount={3}
          {...args}
        />
        <GuideToBuyStandardBundles {...args} />
        <GuideToBuyPremiumBundles {...args} />
        <GuideToCompletedDailyGoals {...args} />
        <GuideToDailyGoals {...args} />
        <GuideToAds
          rewardAmount={3}
          {...args}
        />
        <GuideToAds
          rewardAmount={3}
          {...args}
        />
      </div>
      <div className={styles.button}>
        <Button
          level="secondary"
          size="md"
        >
          Not right now
        </Button>
      </div>
    </div>
  );
};

export const Default = {
  render: Template,
};
