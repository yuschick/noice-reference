import { makeLoggers } from '@noice-com/utils';
import { createContext, useCallback, useContext, useRef } from 'react';

// eslint-disable-next-line import/no-restricted-paths
import { useLazyValue } from '../hooks/useLazyValue.hook';

import { PaymentCurrency } from '@common-gen';
import { WithChildren } from '@common-types';

type SuperEvent = {
  name: string;
  events: string[];
  sent?: boolean;
};

// superEvents defines events that are send once all defined events have happend
// this is done in order to create events that summarize multiple different actions
// the user can do
// As en example we want to sent a event once user has both Signed up and picked a game card
const superEvents: SuperEvent[] = [
  {
    name: 'SignupCompleted_GameCardPicked',
    events: ['SignupCompleted', 'GameCardPicked'],
  },
];

interface Context {
  sendBasicConversionEvent: (event: BasicConversionEvent['event']) => void;
  sendItemPurchasedConversionEvent: (params: ItemPurchasedConversionEventInput) => void;
  sendCardPackPurchasedConversionEvent: (
    params: Omit<CardPackPurchasedConversionEvent, 'event'>,
  ) => void;
  sendGameCardPickedConversionEvent: (
    params: Omit<GameCardPickedConversionEvent, 'event'>,
  ) => void;
  sendGameCardScoredConversionEvent: (
    params: Omit<GameCardScoredConversionEvent, 'event'>,
  ) => void;
  sendLoginConversionEvent: (params: Omit<LoginConversionEvent, 'event'>) => void;
}

type BasicConversionEvent = {
  event:
    | 'ChannelFollowed'
    | 'AdViewed'
    | 'SignupCompleted'
    | 'ChannelPageView'
    | 'GameFinishedMatch';
};

type ItemPurchasedConversionEvent = {
  event: 'ItemPurchased';
  contentType: 'channel-subscription-gift' | 'hard-currency' | 'channel-subscription';
  contentId: string;
  currency: string;
  value: number;
};

type CardPackPurchasedConversionEvent = {
  event: 'CardPackPurchased';
  contentId: string;
  currencyId: string;
};

type GameCardPickedConversionEvent = {
  event: 'GameCardPicked';
  contentId: string;
};

type GameCardScoredConversionEvent = {
  event: 'GameCardScored';
  pointsTotal: number;
};

type LoginConversionEvent = {
  event: 'Login';
  userId: string;
};

export type AnyConversionEvent =
  | BasicConversionEvent
  | ItemPurchasedConversionEvent
  | CardPackPurchasedConversionEvent
  | GameCardPickedConversionEvent
  | GameCardScoredConversionEvent
  | LoginConversionEvent;

type ItemPurchasedConversionEventInput = Omit<
  ItemPurchasedConversionEvent,
  'currency' | 'event' | 'contentId' | 'value'
> & {
  contentId: ItemPurchasedConversionEvent['contentId'] | undefined;
  value: ItemPurchasedConversionEvent['value'] | undefined;
  currency: PaymentCurrency | undefined;
};

interface Props extends WithChildren {
  dataLayer: Record<string, unknown>[];
  onEventSent?: (event: AnyConversionEvent) => void;
}

const { logError } = makeLoggers('ConversionEventsProvider');

const ConversionEventsContext = createContext<Context | null>(null);

export function ConversionEventsProvider({ dataLayer, onEventSent, children }: Props) {
  const gameCardPickedEventSent = useRef(false);
  const gameCardScoredEventSent = useRef(false);
  const superEventState = useLazyValue(() => {
    return JSON.parse(JSON.stringify(superEvents)) as SuperEvent[];
  });

  const pushEventToDataLayer = useCallback(
    (params: AnyConversionEvent) => {
      if (!dataLayer) {
        logError(
          'dataLayer is undefined. Was Google Tag Manager script added to the website?',
        );
        return;
      }

      for (const superEvent of superEventState) {
        if (superEvent.sent) {
          continue;
        }

        // Remove event from the list as it has been triggered
        superEvent.events = superEvent.events.filter((event) => event !== params.event);
        // If all events have been triggered send the super event event
        if (superEvent.events.length === 0) {
          dataLayer.push({ event: superEvent.name });
          onEventSent?.({ event: superEvent.name } as BasicConversionEvent);
          superEvent.sent = true;
        }
      }

      dataLayer.push(params);
      onEventSent?.(params);
    },
    [dataLayer, onEventSent, superEventState],
  );

  const sendBasicConversionEvent = useCallback(
    (event: BasicConversionEvent['event']) => pushEventToDataLayer({ event }),
    [pushEventToDataLayer],
  );

  const sendItemPurchasedConversionEvent = useCallback(
    (params: ItemPurchasedConversionEventInput) => {
      const value = params.value === undefined ? 0 : params.value / 100;
      const contentId = params.contentId === undefined ? 'n/a' : params.contentId;
      const isoCurrency = (
        params.currency ?? PaymentCurrency.CurrencyUnspecified
      )?.replace('CURRENCY_', '');

      pushEventToDataLayer({
        event: 'ItemPurchased',
        ...params,
        currency: isoCurrency,
        value,
        contentId,
      });
    },
    [pushEventToDataLayer],
  );

  const sendCardPackPurchasedConversionEvent = useCallback(
    (params: Omit<CardPackPurchasedConversionEvent, 'event'>) => {
      pushEventToDataLayer({ event: 'CardPackPurchased', ...params });
    },
    [pushEventToDataLayer],
  );

  const sendGameCardPickedConversionEvent = useCallback(
    (params: Omit<GameCardPickedConversionEvent, 'event'>) => {
      if (!gameCardPickedEventSent.current) {
        pushEventToDataLayer({ event: 'GameCardPicked', ...params });
        gameCardPickedEventSent.current = true;
      }
    },
    [pushEventToDataLayer],
  );

  const sendGameCardScoredConversionEvent = useCallback(
    (params: Omit<GameCardScoredConversionEvent, 'event'>) => {
      if (!gameCardScoredEventSent.current) {
        pushEventToDataLayer({ event: 'GameCardScored', ...params });
        gameCardScoredEventSent.current = true;
      }
    },
    [pushEventToDataLayer],
  );

  const sendLoginConversionEvent = useCallback(
    (params: Omit<LoginConversionEvent, 'event'>) =>
      pushEventToDataLayer({ event: 'Login', ...params }),
    [pushEventToDataLayer],
  );

  return (
    <ConversionEventsContext.Provider
      value={{
        sendBasicConversionEvent,
        sendItemPurchasedConversionEvent,
        sendCardPackPurchasedConversionEvent,
        sendGameCardPickedConversionEvent,
        sendLoginConversionEvent,
        sendGameCardScoredConversionEvent,
      }}
    >
      {children}
    </ConversionEventsContext.Provider>
  );
}

/**
 * Conversion events are sent to Google Tag Manager (GTM) where they're mapped to triggers of "Custom Event" type
 */
export const useConversionEvents = () => {
  const context = useContext(ConversionEventsContext);

  if (!context) {
    throw new Error('Trying to access context without ConversionEventsContext');
  }

  return context;
};

export function MockConversionEventsProvider({ children }: WithChildren) {
  return (
    <ConversionEventsContext.Provider
      value={{
        sendBasicConversionEvent: () => {},
        sendItemPurchasedConversionEvent: () => {},
        sendCardPackPurchasedConversionEvent: () => {},
        sendGameCardPickedConversionEvent: () => {},
        sendLoginConversionEvent: () => {},
        sendGameCardScoredConversionEvent: () => {},
      }}
    >
      {children}
    </ConversionEventsContext.Provider>
  );
}
