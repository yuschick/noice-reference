import { gql } from '@apollo/client';
import {
  Anchor,
  Callout,
  Select,
  SelectOption,
  useAnalytics,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import toast from 'react-hot-toast';

import styles from './StreamCategorySelect.module.css';

import { useChannelContext } from '@common/channel';
import { StreamConfig, useGameConnectInfo, useStreamContext } from '@common/stream';
import {
  GameGame,
  GameGameEventsSource,
  useCreateStreamConfigMutation,
  useSelectStreamConfigMutation,
  useStreamCategoryDataQuery,
} from '@gen';

gql`
  query StreamCategoryData($channelId: ID!) {
    streamBackendConfigs(channelId: $channelId) {
      configs {
        id
        gameId
      }
    }

    listGames {
      games {
        id
        name
      }
    }

    selectedStreamBackendConfig(channelId: $channelId) {
      id
      gameId
      game {
        id
        gameEventsSource
      }
    }
  }

  mutation CreateStreamConfig($channelId: ID!, $gameId: ID!) {
    createStreamBackendConfig(channelId: $channelId, gameId: $gameId) {
      id
    }
  }

  mutation SelectStreamConfig($channelId: ID!, $configId: ID!) {
    selectStreamBackendConfig(channelId: $channelId, configId: $configId) {
      emptyTypeWorkaround
    }
  }
`;

type GameConfig = { name: string; id: string; configId: Nullable<string> };

const combineConfigsAndGames = (
  configs: StreamConfig[] | null,
  games?: Pick<GameGame, 'name' | 'id'>[],
): GameConfig[] | null => {
  if (!games || !configs) {
    return null;
  }

  return games.map((game) => {
    const config = configs.find(({ gameId }) => gameId === game.id);

    return {
      id: game.id,
      configId: config?.id ?? null,
      name: game.name,
    };
  });
};

interface Props extends Pick<React.ComponentProps<typeof Select>, 'labelType'> {
  section?: string;
  onGameChanged(gameId: string): void;
}

export const StreamCategorySelect = ({ onGameChanged, labelType, section }: Props) => {
  const { trackAnchorClick } = useAnalytics();
  const { url: gameConnectUrl } = useGameConnectInfo();
  const [createConfig] = useCreateStreamConfigMutation();
  const { channelId } = useChannelContext();
  const { hasRunningProcesses } = useStreamContext();

  const { data, loading } = useStreamCategoryDataQuery({
    variables: { channelId },
    onCompleted: (data) => {
      if (!data.selectedStreamBackendConfig?.gameId) {
        return;
      }
      onGameChanged(data.selectedStreamBackendConfig.gameId);
    },
  });
  const [switchGame, { loading: switchingGame }] = useSelectStreamConfigMutation({
    update: (cache, _, { variables }) => {
      if (!variables?.configId) {
        return;
      }
      cache.modify({
        fields: {
          selectedStreamBackendConfig: () => {
            return {
              __typename: 'ChannelStreamBackendConfig',
              id: variables.configId,
            };
          },
        },
      });
    },
  });

  const games = combineConfigsAndGames(
    data?.streamBackendConfigs?.configs || null,
    data?.listGames?.games,
  );

  const gameOptions: SelectOption[] =
    games?.map((game) => ({
      value: game.id,
      label: game.name,
      type: 'option',
    })) ?? [];

  const onChangeGame = async (value: string) => {
    const gameConfig = games?.find((game) => game.id === value);

    if (!gameConfig) {
      return;
    }

    if (gameConfig.id === data?.selectedStreamBackendConfig?.gameId) {
      return;
    }

    const getConfigId = async (gc: GameConfig) => {
      if (gc.configId) {
        return gc.configId;
      }

      const { data } = await createConfig({
        variables: {
          channelId,
          gameId: gc.id,
        },
      });

      return data?.createStreamBackendConfig?.id || null;
    };

    const configId = await getConfigId(gameConfig);

    if (!configId) {
      toast.error('Could not switch game: No configuration found or could be created.');
      return;
    }

    switchGame({
      variables: {
        channelId,
        configId,
      },
      onCompleted() {
        onGameChanged(gameConfig.id);
      },
    });
  };

  return (
    <div className={styles.wrapper}>
      <Select
        color="gray"
        isDisabled={loading || switchingGame || hasRunningProcesses}
        label="Stream category"
        labelType={labelType}
        options={gameOptions}
        value={data?.selectedStreamBackendConfig?.gameId}
        onChange={(event) => onChangeGame(event.target.value)}
      />

      {data?.selectedStreamBackendConfig?.game.gameEventsSource ===
        GameGameEventsSource.GameEventsSourceGameIntegration && (
        <Callout
          message={
            <span>
              Selected category requires{' '}
              <Anchor
                href={gameConnectUrl}
                rel="noopener noreferrer"
                target="_blank"
                onClick={(e) => {
                  return section && trackAnchorClick(e, section);
                }}
              >
                Noice Game Connect
              </Anchor>{' '}
              to work.
            </span>
          }
          theme="gray"
          type="warning"
          variant="bordered"
        />
      )}

      {data?.selectedStreamBackendConfig?.gameId === 'dead_by_daylight' && (
        <Callout
          message="This video game is labeled Mature because it may not be suitable for all viewers."
          theme="gray"
          type="warning"
          variant="bordered"
        />
      )}
    </div>
  );
};
