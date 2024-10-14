import { gql } from '@apollo/client';
import { Callout, Switch } from '@noice-com/common-ui';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { StreamCategorySelect } from '../StreamCategorySelect';

import styles from './EditCategory.module.css';

import { useChannelContext } from '@common/channel';
import { useStreamContext } from '@common/stream';
import {
  ChannelChannel,
  useEditCategoryDataQuery,
  useUpdateEditStreamInfoPredictionGameMutation,
} from '@gen';

gql`
  query EditCategoryData($channelId: ID!) {
    channel(id: $channelId) {
      id
      features {
        noicePredictions {
          enabled
        }
      }
    }

    listGames {
      games {
        id
        noicePredictionsEnabled
        activeSeason {
          id
          seasonBreak
          seasonBreakReason
        }
      }
    }
  }

  mutation UpdateEditStreamInfoPredictionGame(
    $channelId: ID!
    $featureNoicePredictionsEnabled: Boolean
  ) {
    updateChannelDetails(
      body: {
        id: $channelId
        featureNoicePredictionsEnabled: $featureNoicePredictionsEnabled
      }
    ) {
      id
    }
  }
`;

export function EditCategory() {
  const [selectedGameId, setSelectedGameId] = useState<string>();
  const { channelId } = useChannelContext();
  const { hasRunningProcesses } = useStreamContext();
  const { data, loading } = useEditCategoryDataQuery({
    variables: { channelId },
  });

  const onChangeGame = (gameId: string) => {
    setSelectedGameId(gameId);
  };
  const game = data?.listGames?.games?.find((game) => game.id === selectedGameId);
  const gameActiveSeasonOnBreak = game?.activeSeason?.seasonBreak ?? false;
  const gameActiveSeasonBreakReason =
    game?.activeSeason?.seasonBreakReason || 'No defined reason';
  const noicePredictionsEnabledForGame = game?.noicePredictionsEnabled ?? false;
  const noicePredictionsEnabled =
    data?.channel?.features?.noicePredictions?.enabled ?? false;

  // If the game supports noice predictions, and the game is not on break, then control the channel feature value
  const noicePredictionsToggleChecked =
    noicePredictionsEnabledForGame && !gameActiveSeasonOnBreak
      ? noicePredictionsEnabled
      : false;
  const noicePredictionsToggleDisabled =
    loading ||
    !noicePredictionsEnabledForGame ||
    gameActiveSeasonOnBreak ||
    hasRunningProcesses;

  const [updatePredictionGameEnabled, { loading: loadingTogglePredictionGameEnabled }] =
    useUpdateEditStreamInfoPredictionGameMutation({
      update: (cache, _, { variables }) => {
        if (!variables) {
          return;
        }

        const id = cache.identify({
          id: variables.channelId,
          __typename: 'ChannelChannel',
        });
        cache.modify({
          id,
          fields: {
            features: (existingFeatures: Partial<ChannelChannel['features']>) => ({
              ...existingFeatures,
              noicePredictions: {
                enabled: variables.featureNoicePredictionsEnabled,
              },
            }),
          },
        });
      },
    });

  const onTogglePredictionGame = async (enabled: boolean) => {
    try {
      await updatePredictionGameEnabled({
        variables: {
          channelId,
          featureNoicePredictionsEnabled: enabled,
        },
      });

      toast.success(
        `Noice Predictions have been ${
          enabled ? 'enabled' : 'disabled'
        } for your stream.`,
      );
    } catch (error) {
      toast.error('Could not update Noice Predictions status. Please try again later.');
    }
  };

  return (
    <div className={styles.editCategoryRoot}>
      <StreamCategorySelect onGameChanged={onChangeGame} />

      <div className={styles.editCategoryInputWrapper}>
        <Switch
          checked={noicePredictionsToggleChecked}
          description={`Predictions based card game will be ${
            noicePredictionsToggleChecked ? 'enabled' : 'disabled'
          } for your stream.`}
          disabled={noicePredictionsToggleDisabled}
          isLoading={loadingTogglePredictionGameEnabled}
          label="Noice Predictions"
          onChange={(event) => onTogglePredictionGame(event.target.checked)}
        />
        {gameActiveSeasonOnBreak && (
          <Callout
            message={`Noice Predictions is disabled because of season break: ${gameActiveSeasonBreakReason}`}
            theme="gray"
            type="warning"
            variant="bordered"
          />
        )}
      </div>
    </div>
  );
}
