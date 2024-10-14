import { gql } from '@apollo/client';
import { Anchor, Button, ButtonLink, Callout, useAnalytics } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useState } from 'react';

import { OnboardingStepProps } from '../../types';

import styles from './NoicePredictionsSection.module.css';

import { GameConnectLink } from '@common/button';
import { useChannelContext } from '@common/channel';
import { EditStreamKey, StreamCategorySelect } from '@common/settings';
import { GameGameEventsSource, useNoicePredictionsSectionDataQuery } from '@gen';

gql`
  query NoicePredictionsSectionData {
    listGames {
      games {
        id
        gameEventsSource
      }
    }
  }
`;

export const NoicePredictionsSection = ({
  onCompleted,
  section: sectionProp,
}: OnboardingStepProps) => {
  const section = `${sectionProp}-noice-predictions`;
  const { trackAnchorClick, trackButtonClickEventOnMouseClick, trackEvent } =
    useAnalytics();
  const { channelId } = useChannelContext();
  const [selectedGameId, setSelectedGameId] = useState<string>();
  const { data } = useNoicePredictionsSectionDataQuery();
  const onChangeGame = (gameId: string) => {
    setSelectedGameId(gameId);
  };
  const game = data?.listGames?.games?.find((game) => game.id === selectedGameId);

  return (
    <>
      <Callout
        message="We're built different. Our predictive card game turns viewers into players and super-charges your community engagement."
        slots={{
          actions: {
            primary: (
              <ButtonLink
                size="xs"
                to="https://support.noice.com/hc/en-us/articles/6888155890333-Noice-Prediction-Game"
                onClick={(e) => {
                  trackAnchorClick(e, section);
                }}
              >
                Read more
              </ButtonLink>
            ),
          },
        }}
        theme="gray"
        type="info"
        variant="bordered"
      />
      <div className={styles.streamCategoryWrapper}>
        <div>Select a game to see how to set it up for Noice Predictions</div>

        <StreamCategorySelect
          labelType="hidden"
          section={section}
          onGameChanged={onChangeGame}
        />
        {game?.gameEventsSource === GameGameEventsSource.GameEventsSourceMl && (
          <>
            <Callout
              message="Selected category requires some areas of the game content in your stream to be free from overlays (e.g. your webcam).  First, review your game settings and then check the correct positioning of your overlays by adding the Noice Validator as a source in OBS."
              theme="gray"
              type="warning"
              variant="bordered"
            />
            <div>
              Some game modes might not yet be supported.{' '}
              <Anchor
                href="https://support.noice.com/hc/en-us/articles/19306134389021-Supported-Game-Modes-on-Noice"
                showExternalLinkIcon
                onClick={(e) => {
                  trackAnchorClick(e, section);
                }}
              >
                View list of supported game modes
              </Anchor>
            </div>

            <ol className={styles.steps}>
              <li>
                <div className={styles.title}>VERIFY REQUIRED IN-GAME SETTINGS</div>
                <div>In-game HUD/UI must be between 80-100%.</div>
              </li>
              <li>
                <div className={styles.title}>VERIFY GAME SOURCE IN OBS</div>
                <div>OBS game source must be full screen and 16:9 aspect ratio.</div>
              </li>
              <li>
                <div className={styles.title}>SET UP NOICE VALIDATOR IN OBS</div>
                <div>
                  Check the video below on how to correctly use the Noice Validator.
                </div>
                <video
                  className={classNames(styles.video, styles.stepContent)}
                  controls
                  playsInline
                  onPlay={() => {
                    trackEvent({
                      clientOnboardingVideoPlay: {
                        video: 'obs',
                      },
                    });
                  }}
                >
                  <source
                    src="https://storage.googleapis.com/noice-client-assets-b9745b84/onboarding/onboarding-obs-validator-game-source-ml.mp4"
                    type="video/mp4"
                  />
                </video>
              </li>
            </ol>
          </>
        )}

        {game?.gameEventsSource ===
          GameGameEventsSource.GameEventsSourceGameIntegration && (
          <>
            <div>
              Some game modes might not yet be supported.{' '}
              <Anchor
                href="https://support.noice.com/hc/en-us/articles/19306134389021-Supported-Game-Modes-on-Noice"
                showExternalLinkIcon
              >
                View list of supported game modes
              </Anchor>
            </div>
            <video
              className={styles.video}
              controls
              playsInline
              onPlay={() => {
                trackEvent({
                  clientOnboardingVideoPlay: {
                    video: 'game-connect',
                  },
                });
              }}
            >
              <source
                src="https://storage.googleapis.com/noice-client-assets-b9745b84/onboarding/onboarding-obs-validator-game-source-game-connect.mp4"
                type="video/mp4"
              />
            </video>
            <ol className={styles.steps}>
              <li>
                <div className={classNames(styles.title, styles.withPadding)}>
                  Install Noice Game Connect
                </div>
                <div className={styles.stepContent}>
                  <GameConnectLink hideVersion />
                </div>
              </li>
              <li>
                <div className={styles.title}>Add stream key</div>
                <div>Copy your stream key below and add it to Noice Game Connect.</div>
                <div className={styles.stepContent}>
                  <EditStreamKey
                    channelId={channelId}
                    hideLabel
                    hideNewStreamKeyGenerationButton
                  />
                </div>
              </li>
              <li>
                <div className={styles.title}>Set delay in Game connect</div>
                <div>
                  Set the delay in Game Connect settings to match your stream delay.
                </div>
              </li>
            </ol>
          </>
        )}
      </div>
      <div>
        <Button
          fit="content"
          size="sm"
          variant="cta"
          onClick={(e) => {
            trackButtonClickEventOnMouseClick(e, section);
            onCompleted();
          }}
        >
          Got it
        </Button>
      </div>
    </>
  );
};
