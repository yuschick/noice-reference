import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  VisuallyHidden,
  useAuthentication,
  useBooleanFeatureFlag,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router';

import styles from './Home.module.css';
import { HomeHeader } from './HomeHeader';
import { HomeLiveChannels } from './HomeLiveChannels';
import { HomePageCategoryList } from './HomePageCategoryList';
import { InactivityKickPrompt } from './InactivityKickPrompt/InactivityKickPrompt';

import BackgroundImage1000Avif from '@assets/images/home/noice-home-bg-1000.avif';
import BackgroundImage1000WebP from '@assets/images/home/noice-home-bg-1000.webp';
import BackgroundImage1500Avif from '@assets/images/home/noice-home-bg-1500.avif';
import BackgroundImage1500WebP from '@assets/images/home/noice-home-bg-1500.webp';
import { usePendingAgreements } from '@common/auth/hooks/usePendingAgreements.hook';
import { ChannelListPagesNavigation } from '@common/navigation';
import { PageBackgroundImage } from '@common/page';
import { Routes } from '@common/route';
import { useHomeProfileQuery } from '@gen';

gql`
  query HomeProfile($userId: ID!, $isImplicitAccount: Boolean!) {
    profile(userId: $userId) {
      userId
      ...HomeHeaderProfile
    }

    dailyXPBoostLimit {
      remainingDailyXpBoost
    }

    dailyXPEarningsLimit {
      remainingDailyXpEarningsMinutes
    }
  }
`;

export function Home() {
  const { userId, isImplicitAccount } = useAuthentication();
  const location = useLocation();
  const navigate = useNavigate();
  const [listCategories] = useBooleanFeatureFlag('categoriesListing');

  usePendingAgreements();
  const { data } = useHomeProfileQuery({
    ...variablesOrSkip({
      userId,
      isImplicitAccount,
    }),
  });

  const profile = data?.profile;

  const [isInactivityKickPromptVisible, setIsInactivityKickPromptVisible] =
    useState<boolean>(location.state?.showInactivityKick);

  const onCloseInactivityKickPrompt = useCallback(() => {
    setIsInactivityKickPromptVisible(false);
    navigate(Routes.Home, { replace: true });
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Streams</title>
      </Helmet>

      <VisuallyHidden>
        <h1>Play</h1>
      </VisuallyHidden>

      <PageBackgroundImage
        sources={[
          {
            srcSet: `${BackgroundImage1000Avif} 1000w, ${BackgroundImage1500Avif} 1500w`,
          },
          {
            srcSet: `${BackgroundImage1000WebP} 1000w, ${BackgroundImage1500WebP} 1500w`,
          },
        ]}
        src={BackgroundImage1000Avif}
      />

      <div
        className={classNames(styles.homePageWrapper, {
          [styles.tighterHomePage]: listCategories,
        })}
        data-ftue-anchor="homePage"
      >
        <ChannelListPagesNavigation />

        <HomeHeader
          isDailyXpBoostRemaining={!!data?.dailyXPBoostLimit?.remainingDailyXpBoost}
          noRemainingDailyXpEarnings={
            data?.dailyXPEarningsLimit?.remainingDailyXpEarningsMinutes === 0
          }
          profile={profile ?? null}
        />

        <section className={styles.channelsListWrapper}>
          {listCategories && <HomePageCategoryList />}

          <HomeLiveChannels />
        </section>
      </div>

      {isInactivityKickPromptVisible && (
        <InactivityKickPrompt onClose={onCloseInactivityKickPrompt} />
      )}
    </>
  );
}
