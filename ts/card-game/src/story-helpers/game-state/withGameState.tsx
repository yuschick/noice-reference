import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { GameInitMsg } from '@noice-com/schemas/game-logic/game_logic.pb';
import { ObjectUtils } from '@noice-com/utils';
import { StoryContext } from '@storybook/react';
import { ReactElement, useEffect, useState } from 'react';

import { GameInitBuilder } from '../builders';

import { CardGame } from '@game-logic/game';
import {
  MockStreamGameProvider,
  MockStreamGameProviderProps,
} from '@game-logic/game/context';

const defaultMock = new MockMatchGroup('default-mock-group', 'me');

export const withGameState =
  (
    matchGroupMock: MockMatchGroup = defaultMock,
    initialState: GameInitMsg = {},
    streamGameProviderProps: Partial<MockStreamGameProviderProps> = {},
  ) =>
  (Story: () => ReactElement<unknown, string>, context: StoryContext): JSX.Element => {
    const gqlClient = useApolloClient();
    const [instance] = useState(
      () =>
        new CardGame(
          matchGroupMock.localUserId,
          gqlClient as ApolloClient<NormalizedCacheObject>,
        ),
    );

    const baseMsg = new GameInitBuilder()
      .withStreamId('abcdefg')
      .withGroupId(matchGroupMock.groupId)
      .withLocalPlayerId(matchGroupMock.localUserId)
      .withChallengeStates(initialState.challengeStatesData ?? {})
      .result();

    const [merged] = useState(() => ObjectUtils.deepMerge(baseMsg, initialState));

    useEffect(() => {
      matchGroupMock.addDelegate(instance.delegate);
      matchGroupMock.triggerEvent('onGameInit', merged);
    }, [merged, instance]);

    return (
      <MockStreamGameProvider
        changeTeam={async () => {}}
        channelId={null}
        gameError={null}
        gameInstance={instance}
        isJoiningGame={false}
        isSolo={merged.matchStateData?.group?.isSolo ?? false}
        joinGame={async () => {}}
        leaveGame={async () => {}}
        matchGroupId={matchGroupMock.groupId}
        spectateGame={() => {}}
        streamId={merged.streamId ?? null}
        {...streamGameProviderProps}
      >
        <Story {...context.args} />
      </MockStreamGameProvider>
    );
  };
