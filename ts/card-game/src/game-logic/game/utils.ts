type ValidDelegateType = object;
type EventNameType<DelegateType extends ValidDelegateType> = keyof DelegateType;
type EventNamePayloadType<
  DelegateType extends ValidDelegateType,
  EventNameType extends keyof DelegateType,
> = Parameters<
  DelegateType[EventNameType] extends (...args: unknown[]) => void
    ? DelegateType[EventNameType]
    : () => void
>;

/**
 * Injects a function to be called every time a delegate function is called.
 * The injected function will be called with the event name and payload.
 * @param original The original delegate object.
 * @param injectFn The function to be called every time a delegate function is called.
 */
export function injectDelegateMiddleware<
  DelegateType extends ValidDelegateType,
  DelegateEventNameType extends EventNameType<DelegateType> = EventNameType<DelegateType>,
>(
  original: DelegateType,
  injectFn: <EventNameType extends DelegateEventNameType = DelegateEventNameType>(
    eventName: EventNameType,
    payload: EventNamePayloadType<DelegateType, EventNameType>,
  ) => void,
): DelegateType {
  const newDelegate: Partial<DelegateType> = {};

  for (const eventName of Object.keys(original)) {
    const originalFn = original[eventName as DelegateEventNameType] as (
      ...args: EventNamePayloadType<DelegateType, EventNameType<DelegateType>>
    ) => void;

    // @ts-expect-error TS is very strict about this needing to be a Tuple,
    // but we know that it's a Tuple because we're using the same type to generate it.
    // This seems to be a common issue with auto-generated types.
    // @see: https://stackoverflow.com/questions/68884073/spreading-an-array-in-a-typescript-function-error-ts2556
    newDelegate[eventName as DelegateEventNameType] = (
      ...args: EventNamePayloadType<DelegateType, EventNameType<DelegateType>>
    ) => {
      originalFn(...args);
      injectFn(eventName as DelegateEventNameType, args);
    };
  }

  return newDelegate as Required<DelegateType>;
}

/**
 * Returns new object with all private fields and functions removed.
 * Usable for logging and debugging.
 * Nest level must be limited to prevent infinite recursion on circular objects.
 * @param obj The original object which to clean up.
 * @param maxNestLevel The maximum level of nesting to clean up. Deeper levels will be dropped.
 */
export const dropPrivateAndNonPrimitiveFields = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any>,
  maxNestLevel: number,
) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (maxNestLevel === 0) {
    return {};
  }

  const result: typeof obj = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    if (key.startsWith('_')) {
      continue;
    }

    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      result[key] = dropPrivateAndNonPrimitiveFields(value, maxNestLevel - 1);
    } else if (typeof value !== 'function') {
      result[key] = value;
    }
  }

  return result;
};
