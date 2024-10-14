import { gql } from '@apollo/client';
import {
  Button,
  Callout,
  InputField,
  Select,
  SelectOption,
  useFeatureFlag,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useLayoutEffect, useRef, useState } from 'react';

import { useStreamedGamesContext } from '../context';

import styles from './BaseCardFormFields.module.css';

import {
  ListGameLogicCardFragment,
  useListCreatorCardBaseCardsQuery,
  useListCreatorCardBaseCardsAllQuery,
} from '@gen';

gql`
  query ListCreatorCardBaseCards($gameId: ID!, $seasonId: ID!) {
    items(
      filters: [
        { gameId: $gameId }
        { seasonId: $seasonId }
        { itemType: TYPE_GAME_CARD }
        { attribute: { name: "unlock_level", value: { intValue: 1 } } }
      ]
    ) {
      items {
        id
        details {
          ...ListGameLogicCard
        }
      }
    }
  }

  query ListCreatorCardBaseCardsAll($gameId: ID!, $seasonId: ID!) {
    items(
      filters: [
        { gameId: $gameId }
        { seasonId: $seasonId }
        { itemType: TYPE_GAME_CARD }
      ]
    ) {
      items {
        id
        details {
          ...ListGameLogicCard
        }
      }
    }
  }

  fragment ListGameLogicCard on GameLogicCard {
    id
    familyId
    name
  }
`;

interface Props {
  existingBaseCard?: {
    id: string;
    name: string;
  };
  onNameChange(name: string): void;
  onGameIdChange(gameId: string): void;
  onFamilyIdChange(familyId: string): void;
  onBaseCardIdChange(baseCardId: string): void;
}

export function BaseCardFormFields({
  existingBaseCard,
  onNameChange,
  onGameIdChange,
  onFamilyIdChange,
  onBaseCardIdChange,
}: Props) {
  const { selectedGameId: selectedGameIdFromContext, games } = useStreamedGamesContext();

  const [selectedGameId, setSelectedGameId] = useState<Nullable<string>>(null);

  const gameSelectRef = useRef<HTMLSelectElement>(null);
  const baseCardSelectRef = useRef<HTMLSelectElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (gameSelectRef.current) {
      gameSelectRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (baseCardSelectRef.current) {
      baseCardSelectRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (nameInputRef.current) {
      nameInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [selectedGameIdFromContext]);

  const selectedSeasonId = games.find(
    (g) => g.id === (selectedGameId ?? selectedGameIdFromContext),
  )?.activeSeason.id;

  const [allowAllBaseCards] = useFeatureFlag('streamerCardsAllowAllBaseCards', 'false');

  const params = {
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      gameId: selectedGameId ?? selectedGameIdFromContext!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      seasonId: selectedSeasonId!,
    },
    skip: !selectedGameIdFromContext || !selectedSeasonId,
  };

  const { data: baseCardList, loading: baseCardsLoading } =
    useListCreatorCardBaseCardsQuery(params);

  const { data: baseCardListAll } = useListCreatorCardBaseCardsAllQuery(params);

  const list = allowAllBaseCards === 'true' ? baseCardListAll : baseCardList;

  const baseCards =
    list?.items?.items.map(({ details }) => details as ListGameLogicCardFragment) ?? [];

  const gameOptions = games.map<SelectOption>(({ name, id, activeSeason }) => ({
    type: 'option',
    label: `${name} - ${activeSeason.name}`,
    value: id,
  }));

  const cardOptions: SelectOption[] = [
    { type: 'option', label: 'Select a card', value: '' },
    ...baseCards.map<SelectOption>(({ name, id }) => ({
      type: 'option',
      label: name,
      value: id,
    })),
  ];

  const onGameChange = (gameId: string) => {
    setSelectedGameId(gameId);
    onGameIdChange(gameId);
  };

  const onBaseCardChange = (id: string) => {
    const familyId = baseCards.find((c) => c.id === id)?.familyId;

    onFamilyIdChange(familyId ?? '');
    onBaseCardIdChange(id);
  };

  if (!selectedGameIdFromContext) {
    return null;
  }

  return (
    <div className={styles.inputs}>
      {!baseCardsLoading && (!games.length || !baseCards.length) ? (
        <Callout
          message="Looks like we had trouble loading the game or cards list. Please try again."
          slots={{
            actions: {
              primary: (
                <Button
                  size="xs"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              ),
            },
          }}
          type="error"
          variant="bordered"
        />
      ) : (
        <>
          {!!games.length && (
            <Select
              color="gray"
              defaultValue={selectedGameIdFromContext ?? undefined}
              label="Game"
              options={gameOptions}
              ref={gameSelectRef}
              onChange={(e) => onGameChange(e.target.value)}
            />
          )}

          {!!baseCards.length && (
            <Select
              color="gray"
              defaultValue={existingBaseCard?.id}
              label="Card"
              options={cardOptions}
              ref={baseCardSelectRef}
              onChange={(e) => onBaseCardChange(e.target.value)}
            />
          )}

          <InputField
            defaultValue={existingBaseCard?.name}
            label="Card name"
            ref={nameInputRef}
            theme="gray"
            onChange={(e) => onNameChange(e.target.value)}
          />
        </>
      )}
    </div>
  );
}
