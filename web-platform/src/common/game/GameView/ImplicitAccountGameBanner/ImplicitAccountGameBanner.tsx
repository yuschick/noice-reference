import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  ButtonLink,
  CommonUtils,
  IconButton,
  Image,
  useAnalytics,
  useAuthenticatedUser,
  useMediaQuery,
} from '@noice-com/common-ui';
import { AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './ImplicitAccountGameBanner.module.css';

import Cards from '@assets/images/up-selling-game-banner-cards.webp';
import { GameProgression } from '@common/game-progression';
import { useSignupTo } from '@common/route';
import { useImplicitAccountGameBannerRankQuery } from '@gen';

gql`
  query ImplicitAccountGameBannerRank($userId: ID!) {
    profile(userId: $userId) {
      userId
      playedGames {
        userId
        id
        game {
          id
          ...GameProgressionGame
        }
      }
    }
  }
`;

interface Props {
  gameId: Nullable<string>;
  onSkip(): void;
}

export function ImplicitAccountGameBanner({ gameId, onSkip }: Props) {
  const { userId } = useAuthenticatedUser();
  const largeDevice = useMediaQuery(`(min-width: ${CommonUtils.getRem(1200)})`);
  const { trackEvent } = useAnalytics();
  const signupTo = useSignupTo();

  const onClick = () => {
    trackEvent({
      clientSignupButtonClick: {
        action:
          AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType.ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_SIGNUP,
        section: 'implicit-account-game-banner',
      },
    });
  };

  const { data } = useImplicitAccountGameBannerRankQuery({
    variables: { userId },
    skip: !largeDevice || !gameId,
    // To make sure we have always the latest data, fetch from network
    fetchPolicy: 'cache-and-network',
  });

  const game = data?.profile?.playedGames.find(
    (playedGame) => playedGame.game.id === gameId,
  )?.game;

  return (
    <section
      className={classNames(styles.implicitAccountGameBannerWrapper, {
        [styles.hasRank]: !!game,
      })}
    >
      <div className={styles.implicitAccountGameBanner}>
        <div className={styles.upsellSection}>
          <div className={styles.cardSection}>
            <span className={styles.upsellSectionTitle}>
              Play the stream and Level up your cards
            </span>

            <Image
              alt="Noice Cards"
              className={styles.cardsImage}
              src={Cards}
              width={270}
            />
          </div>

          {game && (
            <div className={styles.rankSection}>
              <span className={styles.upsellSectionTitle}>
                Rank up to receive rewards & unlock new cards
              </span>

              <GameProgression progression={game} />
            </div>
          )}
        </div>

        <div className={styles.signupSection}>
          <div className={styles.signupSectionContent}>
            <span className={styles.signupSectionTitle}>
              Create an account to save your progress
            </span>

            <span className={styles.signupSectionDivider} />

            <span>
              You will lose your current season progress and rewards if you do not sign
              up.
            </span>

            <ButtonLink
              fit="content"
              theme="dark"
              to={signupTo}
              onClick={onClick}
            >
              Sign up
            </ButtonLink>
          </div>
        </div>

        <div className={styles.closeButton}>
          <IconButton
            icon={CoreAssets.Icons.Close}
            label="Skip"
            size="sm"
            theme="dark"
            variant="ghost"
            onClick={onSkip}
          />
        </div>
      </div>
    </section>
  );
}
