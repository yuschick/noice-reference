import { gql } from '@apollo/client';
import { Button, Image, Select, SelectOption, useAnalytics } from '@noice-com/common-ui';
import { DeepPartial, Nullable } from '@noice-com/utils';
import { FormEvent, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import styles from './ArenaBlock.module.css';

import { LayoutBox } from '@common/layout';
import { useStreamContext } from '@common/stream';
import {
  ArenaBlockArenaFragment,
  ArenaBlockChannelStreamBackendConfigFragmentDoc,
  ChannelStreamBackendConfig,
  useArenaBlockStreamSettingsQuery,
  useArenaBlockUpdateCrConfigMutation,
} from '@gen';

gql`
  fragment ArenaBlockArena on ArenaArena {
    id
    name
    thumbnailUrl
    enabled
  }

  fragment ArenaBlockChannelStreamBackendConfig on ChannelStreamBackendConfig {
    id
    crConfig {
      arenaId
      containerImage
      controllerContainerImage
    }
  }

  mutation ArenaBlockUpdateCrConfig(
    $id: ID!
    $channelId: ID!
    $containerImage: String
    $controllerContainerImage: String
    $arenaId: ID
  ) {
    updateStreamBackendConfig(
      body: {
        id: $id
        channelId: $channelId
        crConfig: {
          containerImage: $containerImage
          controllerContainerImage: $controllerContainerImage
          arenaId: $arenaId
        }
      }
    ) {
      ...ArenaBlockChannelStreamBackendConfig
    }
  }

  query ArenaBlockStreamSettings($channelId: ID!) {
    selectedStreamBackendConfig(channelId: $channelId) {
      id
      ...ArenaBlockChannelStreamBackendConfig
    }

    arenas(channelId: $channelId) {
      arenas {
        ...ArenaBlockArena
      }
    }
  }
`;

interface Props {
  channelId: string;
}

// If channel doesn't have arenaId in crConfig, this is the arenaId that will be used
const CR_DEFAULT_ARENA_ID = 'Gameroom';

export function ArenaBlock({ channelId }: Props) {
  const { trackEvent } = useAnalytics();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [selectedArena, setSelectedArena] =
    useState<Nullable<ArenaBlockArenaFragment>>(null);
  const { isStreamOffline } = useStreamContext();

  const { data: streamSettings, loading } = useArenaBlockStreamSettingsQuery({
    variables: { channelId },
    onCompleted(data) {
      setSelectedArena(
        data.arenas?.arenas.find(
          (arena) =>
            arena.id ===
            (data.selectedStreamBackendConfig?.crConfig?.arenaId ?? CR_DEFAULT_ARENA_ID),
        ) ?? null,
      );
    },
  });

  const [updateCrConfig] = useArenaBlockUpdateCrConfigMutation({
    onCompleted: () => {
      toast.success('Arena changed!');
    },
    onError: (error) => {
      toast.error(`Error while changing arena: ${error.message}`);
    },
    update(cache, result) {
      cache.updateFragment<DeepPartial<ChannelStreamBackendConfig>>(
        {
          id: cache.identify({
            id: result.data?.updateStreamBackendConfig?.id,
            __typename: 'ChannelStreamBackendConfig',
          }),
          fragment: ArenaBlockChannelStreamBackendConfigFragmentDoc,
        },
        (data) => ({
          ...data,
          crConfig: {
            ...data?.crConfig,
            containerImage:
              result.data?.updateStreamBackendConfig?.crConfig?.containerImage ??
              data?.crConfig?.containerImage,
            controllerContainerImage:
              result.data?.updateStreamBackendConfig?.crConfig
                ?.controllerContainerImage ?? data?.crConfig?.controllerContainerImage,
            arenaId:
              result.data?.updateStreamBackendConfig?.crConfig?.arenaId ??
              data?.crConfig?.arenaId,
          },
        }),
      );
    },
  });

  const arenaOptions: SelectOption[] =
    [...(streamSettings?.arenas?.arenas ?? [])]
      .sort((a, b) => {
        return a.enabled === b.enabled ? 0 : a.enabled && !b.enabled ? -1 : 1;
      })
      .map((arena) => {
        const arenaName = `${arena.name}${arena.enabled ? '' : ' - TESTING ONLY'}`;

        return {
          type: 'option',
          value: arena.id,
          label: arenaName,
        };
      }) ?? [];

  const onArenaSelected = () => {
    setSelectedArena(
      streamSettings?.arenas?.arenas.find(
        (arena) => arena.id === selectRef.current?.value,
      ) ?? null,
    );
  };

  const onSubmitArena = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!streamSettings?.selectedStreamBackendConfig || !selectedArena) {
      return;
    }

    await updateCrConfig({
      variables: {
        channelId,
        id: streamSettings.selectedStreamBackendConfig.id,
        arenaId: selectedArena.id,
        containerImage:
          streamSettings.selectedStreamBackendConfig.crConfig?.containerImage,
        controllerContainerImage:
          streamSettings.selectedStreamBackendConfig.crConfig?.controllerContainerImage,
      },
    });

    trackEvent({
      studioChannelArenaChanged: {
        arenaId: selectedArena.id,
        arenaName: selectedArena.name,
      },
    });
  };

  if (loading) {
    return null;
  }

  return (
    <LayoutBox>
      {isStreamOffline ? (
        <form
          className={styles.wrapper}
          onSubmit={onSubmitArena}
        >
          <Select
            color="gray"
            defaultValue={
              streamSettings?.selectedStreamBackendConfig?.crConfig?.arenaId ??
              CR_DEFAULT_ARENA_ID
            }
            label="Select arena"
            options={arenaOptions}
            ref={selectRef}
            onChange={onArenaSelected}
          />
          {!!selectedArena && (
            <Image
              alt={`Preview of ${selectedArena.name} arena`}
              className={styles.arenaPreviewImage}
              fit="contain"
              src={selectedArena.thumbnailUrl}
            />
          )}
          <Button
            fit="content"
            size="sm"
            type="submit"
          >
            Save
          </Button>
        </form>
      ) : (
        <span>You can only change when channel is offline</span>
      )}
    </LayoutBox>
  );
}
