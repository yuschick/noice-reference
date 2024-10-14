import { SetTimeoutId } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import {
  ActiveCardFailedMsgReason,
  ChallengeState,
  MatchBonusType,
  StreamStateMatchType,
  StreamStateRoundPhase,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { StoryContext } from '@storybook/react';
import { ReactElement, useEffect, useRef, useState } from 'react';

import { AON_DECISION_DURATION } from '@game-constants';

const logger = makeLoggers('withTriggerEvents');

export const withTriggerEvents =
  (mockMatchGroup: MockMatchGroup, userIds: string[]) =>
  (Story: () => ReactElement<unknown, string>, context: StoryContext) => {
    const matchPausedRef = useRef(false);
    const [userId, setUserId] = useState<Nullable<string>>(null);
    const timeoutRefs = useRef<SetTimeoutId[]>([]);

    const defaultUserId = userIds[0] ?? null;
    useEffect(() => {
      setUserId(defaultUserId);
    }, [defaultUserId]);

    if (!userIds.length) {
      logger.logWarn(
        'No user ids provided to withTriggerEvents! Not rendering game state trigger buttons to story',
      );
      return <Story {...context.args} />;
    }

    // @todo ad more events and make the team mate userId more configurable
    const victoryRoyale = (userId: string) =>
      mockMatchGroup.triggerEvent('onMatchBonusReceived', {
        userId,
        bonusType: MatchBonusType.MATCH_BONUS_TYPE_VICTORY_ROYAL,
        points: 2000,
      });

    const cardSuccess = (userId: string) => {
      mockMatchGroup.triggerEvent('onPlayerPointsUpdated', {
        userId,
        points: 2000,
      });
      mockMatchGroup.triggerEvent('onActiveCardSucceeded', {
        userId,
        points: 500,
      });
    };

    const cardAoNSuccess = (userId: string) => {
      mockMatchGroup.triggerEvent('onActiveCardSucceeded', {
        userId,
        points: 475,
        allOrNothing: {
          nextPoints: 950,
          cardId: 'all-or-nothing-card-id',
          totalPoints: 475,
        },
      });

      // If not local user, lets simulate the collect action
      if (userId !== mockMatchGroup.localUserId) {
        timeoutRefs.current.push(
          setTimeout(() => {
            mockMatchGroup.triggerEvent('onPlayerPointsUpdated', {
              userId,
              points: 2000,
            });
            mockMatchGroup.triggerEvent('onAonPointsCollected', {
              userId,
              points: 575,
            });
          }, AON_DECISION_DURATION),
        );
      }
    };

    const cardAoNCollect = (userId: string) => {
      mockMatchGroup.triggerEvent('onPlayerPointsUpdated', {
        userId,
        points: 2000,
      });
      mockMatchGroup.triggerEvent('onAonPointsCollected', {
        userId,
        points: 575,
      });
    };

    const bestPlay = (userId: string) => {
      mockMatchGroup.triggerEvent('onPlayerPointsUpdated', {
        userId,
        points: 2000,
      });
      mockMatchGroup.triggerEvent('onActiveCardSucceeded', {
        userId,
        points: 500,
        bestPlay: {
          // TODO: might need a system to pass an actual card id here
          cardId: 'best-play-card-id',
          points: 2000,
        },
      });
    };

    const cardFailed = (userId: string) =>
      mockMatchGroup.triggerEvent('onActiveCardFailed', {
        userId,
        points: 2000,
        reason: ActiveCardFailedMsgReason.REASON_CARD_FAILED,
      });

    const playerLeft = (userId: string) =>
      mockMatchGroup.triggerEvent('onPlayerLeft', {
        userId,
        groupId: mockMatchGroup.groupId,
        permanent: false,
      });

    const playerLeftPermanent = (userId: string) =>
      mockMatchGroup.triggerEvent('onPlayerLeft', {
        userId,
        groupId: mockMatchGroup.groupId,
        permanent: true,
      });

    const playerJoined = (userId: string) =>
      mockMatchGroup.triggerEvent('onPlayerJoined', {
        userId,
        groupId: mockMatchGroup.groupId,
        player: {
          userId,
          isOnline: true,
        },
      });

    const matchStart = () => mockMatchGroup.triggerEvent('onMatchStarted', {});
    const matchEnd = () => mockMatchGroup.triggerEvent('onMatchEnded', {});

    const roundCompetition = () =>
      mockMatchGroup.triggerEvent('onRoundPhaseChanged', {
        matchType: StreamStateMatchType.MATCH_TYPE_MULTI_ROUND,
        roundPhase: StreamStateRoundPhase.ROUND_PHASE_COMPETITION,
        roundNumber: 1,
      });
    const roundEnded = () =>
      mockMatchGroup.triggerEvent('onRoundPhaseChanged', {
        matchType: StreamStateMatchType.MATCH_TYPE_MULTI_ROUND,
        roundPhase: StreamStateRoundPhase.ROUND_PHASE_ENDED,
        roundNumber: 1,
      });
    const roundPreparation = () => {
      mockMatchGroup.triggerEvent('onRoundPhaseChanged', {
        matchType: StreamStateMatchType.MATCH_TYPE_MULTI_ROUND,
        roundPhase: StreamStateRoundPhase.ROUND_PHASE_PREPARATION,
        roundPhaseDeadline: `${new Date().getTime() + 17000}`,
        roundNumber: 1,
      });

      timeoutRefs.current.push(
        setTimeout(
          () =>
            mockMatchGroup.triggerEvent('onRoundPhaseChanged', {
              matchType: StreamStateMatchType.MATCH_TYPE_MULTI_ROUND,
              roundPhase: StreamStateRoundPhase.ROUND_PHASE_COMPETITION,
              roundNumber: 1,
            }),
          17000,
        ),
      );
    };

    const toggleMatchPaused = () => {
      matchPausedRef.current = !matchPausedRef.current;
      mockMatchGroup.triggerEvent('onMatchPauseStateChanged', {
        paused: matchPausedRef.current,
      });
    };

    const challengesLocked = () => {
      mockMatchGroup.triggerEvent('onChallengePicksLocked', {
        pickRates: {
          '1': 0.5,
          '2': 0.4,
          '3': 0.1,
        },
      });
    };

    const challengeTargetValuesChange = () => {
      mockMatchGroup.triggerEvent('onChallengeEvent', {
        challengeId: '2',
        challengeState: ChallengeState.CHALLENGE_STATE_UNRESOLVED,
        targetValues: [{ label: 'amount', value: 1337 }],
      });
    };

    const challengeSucceeded = () => {
      mockMatchGroup.triggerEvent('onChallengeEvent', {
        challengeId: '2',
        challengeState: ChallengeState.CHALLENGE_STATE_SUCCESS,
      });
    };

    const challengeFailed = () => {
      mockMatchGroup.triggerEvent('onChallengeEvent', {
        challengeId: '2',
        challengeState: ChallengeState.CHALLENGE_STATE_FAILURE,
      });
    };

    const globalsUpdated = () => {
      mockMatchGroup.triggerEvent('onGlobalsUpdated', {
        globals: [{ name: 'teamNameHome', stringValue: 'Liverpool' }],
      });
    };

    useEffect(() => {
      const refs = timeoutRefs.current;

      return () => {
        refs.forEach(clearTimeout);
      };
    }, []);

    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 2,
          }}
        >
          <select onChange={(event) => setUserId(event.target.value ?? null)}>
            {userIds.map((userId) => (
              <option
                key={userId}
                value={userId}
              >
                {userId}
              </option>
            ))}
          </select>
          {!!userId && (
            <>
              <button onClick={() => victoryRoyale(userId)}>Victory Royale</button>
              <button onClick={() => cardSuccess(userId)}>Card Success</button>
              <button onClick={() => cardAoNSuccess(userId)}>Card Success (AoN)</button>
              <button onClick={() => cardAoNCollect(userId)}>AoN collect</button>
              <button onClick={() => bestPlay(userId)}>Best Play</button>
              <button onClick={() => cardFailed(userId)}>Card Failed</button>
              <button onClick={() => playerLeft(userId)}>Player Left</button>
              <button onClick={() => playerLeftPermanent(userId)}>
                Player Left (permanently)
              </button>
              <button onClick={() => playerJoined(userId)}>Player Joined</button>
              <button onClick={() => matchStart()}>Match Started</button>
              <button onClick={() => matchEnd()}>Match Ended</button>
              <button onClick={() => toggleMatchPaused()}>Toggle Match Paused</button>
              <button onClick={() => roundPreparation()}>Round Preparation</button>
              <button onClick={() => roundCompetition()}>Round Competition</button>
              <button onClick={() => roundEnded()}>Round Ended</button>
              <button onClick={() => challengesLocked()}>Challenges Locked</button>
              <button onClick={() => challengeTargetValuesChange()}>
                Challenge Target Values Change
              </button>
              <button onClick={() => challengeSucceeded()}>Challenge Succeeded</button>
              <button onClick={() => challengeFailed()}>Challenge Failed</button>
              <button onClick={() => globalsUpdated()}>Globals Updated</button>
            </>
          )}
        </div>
        <Story {...context.args} />
      </div>
    );
  };
