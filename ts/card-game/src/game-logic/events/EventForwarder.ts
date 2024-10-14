import EventEmitter from 'eventemitter3';

export class EventForwarder<EventMap extends EventEmitter.ValidEventTypes> {
  public static readonly WildcardCharacter = '*';

  private _emitters: Map<string, EventEmitter<EventMap>> = new Map();
  private _wildcardEmitter?: EventEmitter<EventMap>;

  public get listenerCount(): number {
    let count = 0;

    const emitters = [...this._emitters.values()];

    for (let i = 0, emitter: EventEmitter<EventMap>; i < emitters.length; i++) {
      emitter = emitters[i];
      count += emitter
        .eventNames()
        .reduce((result, evName) => result + emitter.listenerCount(evName), 0);
    }

    return count;
  }

  public emit<EventName extends EventEmitter.EventNames<EventMap>>(
    filterId: string,
    event: EventName,
    ...args: Parameters<EventEmitter.EventListener<EventMap, EventName>>
  ) {
    const emitter = this._emitters.get(filterId);
    emitter?.emit(event, ...args);
    if (filterId !== EventForwarder.WildcardCharacter) {
      // Don't emit wildcard events twice as it exists in emitters map already
      this._wildcardEmitter?.emit(event, ...args);
    }
  }

  public emitAll<EventName extends EventEmitter.EventNames<EventMap>>(
    event: EventName,
    ...args: Parameters<EventEmitter.EventListener<EventMap, EventName>>
  ) {
    this._emitters.forEach((emitter) => emitter.emit(event, ...args));
  }

  public addListener<EventName extends EventEmitter.EventNames<EventMap>>(
    filterId: string,
    event: EventName,
    fn: EventEmitter.EventListener<EventMap, EventName>,
  ) {
    let emitter = this._emitters.get(filterId);

    if (!emitter) {
      emitter = new EventEmitter();
      this._emitters.set(filterId, emitter);
    }

    if (filterId === EventForwarder.WildcardCharacter) {
      this._wildcardEmitter = emitter;
    }

    emitter.addListener(event, fn);
  }

  public removeListener<EventName extends EventEmitter.EventNames<EventMap>>(
    filterId: string,
    event: EventName,
    fn: EventEmitter.EventListener<EventMap, EventName>,
  ) {
    const emitter = this._emitters.get(filterId);
    emitter?.removeListener(event, fn);
  }

  public removeAllListeners(filterId?: string) {
    if (filterId) {
      const emitter = this._emitters.get(filterId);
      emitter?.removeAllListeners();
    } else {
      this._emitters.forEach((emitter) => emitter.removeAllListeners());
    }
  }
}
