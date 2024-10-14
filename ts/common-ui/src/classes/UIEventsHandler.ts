import {
  EventEmitter,
  EventArgs as EventEmitterArgs,
  EventNames as EventEmitterNames,
  EventListener as EventEmitterListener,
} from 'eventemitter3';

// With tricky types, easier to have dummy event than to have to deal with
// default no events
export enum CommonUIEventType {
  Dummy = 'dummy',
}

export interface CommonUIEvents {
  [CommonUIEventType.Dummy]: [];
}

export type EventNames<E extends CommonUIEvents> = EventEmitterNames<E>;
export type EventArgs<
  E extends CommonUIEvents,
  T extends EventNames<E>,
> = EventEmitterArgs<E, T>;
export type EventListener<
  E extends CommonUIEvents,
  T extends EventNames<E>,
> = EventEmitterListener<E, T>;

export class UIEventsHandler<
  E extends CommonUIEvents = CommonUIEvents,
> extends EventEmitter<E> {
  public async emitPromise<T extends EventNames<E>>(
    event: T,
    ...args: EventArgs<E, T>
  ): Promise<void> {
    const promises = this.listeners(event);
    await Promise.all(promises.map((fn) => fn(...args)));
  }
}
