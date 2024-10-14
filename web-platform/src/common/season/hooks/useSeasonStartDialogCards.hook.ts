import { gql, useApolloClient } from '@apollo/client';
import { useClient, useMountEffect } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SeasonStartDialog } from '../SeasonStartDialog/SeasonStartDialog';

import { useTriggerUIEvent, AppUIEventType } from '@common/ui-event';
import {
  SeasonStartDialogCardFragment,
  UseSeasonStartDialogCardsQuery,
  UseSeasonStartDialogCardsDocument,
} from '@gen';

const log = makeLoggers('UseSeasonStartDialogCards');

gql`
  query UseSeasonStartDialogCards($ids: [String!]!) {
    itemsBatchExpand(ids: $ids) {
      items {
        id
        type
        details {
          ...SeasonStartDialogCard
        }
      }
    }
  }

  ${SeasonStartDialog.fragments.entry}
`;

interface HookResult {
  cards: SeasonStartDialogCardFragment[];
  isStarterCards: boolean;
  onDialogClosed(): void;
}

export function useSeasonStartDialogCards(): HookResult {
  const cardsFoundRef = useRef(false);
  const client = useClient();
  const { isImplicitAccount } = useAuthenticatedUser();
  const [cards, setCards] = useState<SeasonStartDialogCardFragment[]>([]);
  const [isStarterCards, setStarterCards] = useState<boolean>(false);
  const triggerUIEvent = useTriggerUIEvent();

  // need to use apolloClient directly instead of lazy query since
  // sometimes multiple events might come simultaneously and lazy
  // query cannot handle multiple requests at once
  const apolloClient = useApolloClient();

  const onClose = useCallback(() => {
    setCards([]);
    cardsFoundRef.current = false;
  }, []);

  useMountEffect(() => {
    const handleInventoryUpdatedEvent = async (itemIds: string[]) => {
      // ref check is to avoid a corner case of multiple events containing cards
      // (we only need to pick cards once)
      if (cardsFoundRef.current) {
        return;
      }

      if (isImplicitAccount) {
        return;
      }

      const { data } = await apolloClient.query<UseSeasonStartDialogCardsQuery>({
        query: UseSeasonStartDialogCardsDocument,
        variables: { ids: itemIds },
      });

      // Only consider game cards inventory updates
      const cards: SeasonStartDialogCardFragment[] =
        data?.itemsBatchExpand?.items
          .filter((item) => item.details?.__typename === 'GameLogicCard')
          .map((item) => item.details as SeasonStartDialogCardFragment) ?? [];

      if (!cards.length) {
        return;
      }

      cardsFoundRef.current = true;

      setCards(cards.length < 3 ? cards : cards.slice(0, 3));
    };

    return client.NotificationService.notifications({
      onInventoryUpdate(_, ev) {
        let isStarterCards = false;

        const itemIds = ev.events
          ?.filter((item) => !!item.reason?.provision)
          ?.map((item) => {
            if (item.reason?.provision?.rev === '') {
              isStarterCards = true;
            }
            return item.entitlement?.itemId;
          })
          .filter(Boolean) as string[];

        if (!itemIds.length) {
          return;
        }

        setStarterCards(isStarterCards);

        // fire and forget the handling part so that we can handle multiple events
        handleInventoryUpdatedEvent(itemIds).catch((err) => log.logError(err));
      },
    });
  });

  useEffect(() => {
    triggerUIEvent(AppUIEventType.StartingCardsDialogOpen, !!cards.length);
  }, [cards.length, triggerUIEvent]);

  return { cards, isStarterCards, onDialogClosed: onClose };
}
