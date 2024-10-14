import { IMatchGroupDelegate } from '@noice-com/platform-client';

import { EventForwarder } from './EventForwarder';

type IgnoredEvents = 'onActiveCardSet';

type RemappedDelegate = {
  [DelegateKey in keyof Omit<IMatchGroupDelegate, IgnoredEvents>]: [
    ev: Parameters<IMatchGroupDelegate[DelegateKey]>[1],
  ];
};

export interface EventDelegateMap extends RemappedDelegate {
  onActiveCardSet: [ev: Parameters<IMatchGroupDelegate['onActiveCardSet']>[1]];
}

export class DelegateEventForwarder extends EventForwarder<EventDelegateMap> {}
