import { useClient } from '@noice-com/common-react-core';
import { IFeatureFlags } from '@noice-com/platform-client';
import { FeatureFlagState } from '@noice-com/schemas/flag/flag.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { MockedFeatureFlags } from './mocks/MockedFeatureFlag';

import { WithChildren } from '@common-types';

const { logError } = makeLoggers('FEATURE_FLAGS');

interface ContextState {
  flags: IFeatureFlags | undefined;
  loading: boolean;
}

const Context = createContext<Nullable<ContextState>>(null);

export function FeatureFlagProvider({ children }: WithChildren) {
  const client = useClient();
  const [flags, setFlags] = useState<IFeatureFlags>();

  useEffect(() => {
    return client.FeatureFlagService.onFeatureFlagsUpdate((flags: IFeatureFlags) => {
      setFlags(flags);
    });
  }, [client]);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const flags = await client.FeatureFlagService.getFeatureFlags();
        setFlags(flags);
      } catch (err) {
        logError(err);
      }
    };

    if (client.auth?.uid) {
      fetchFlags();
      return;
    }

    return client.onAuthenticated(() => {
      fetchFlags();
    });
  }, [client]);

  return (
    <Context.Provider value={{ flags, loading: !flags }}>{children}</Context.Provider>
  );
}

export function useFeatureFlags(
  mode?: 'default' | 'silent',
): [IFeatureFlags | undefined, boolean] {
  const context = useContext(Context);

  if (!context && mode !== 'silent') {
    throw new Error('Trying to access feature flag context without provider');
  }

  return [context?.flags, context?.loading || false];
}

export function useFeatureFlag(
  featureFlag: string,
  defaultValue: string,
): [string, boolean] {
  const [featureFlags, loading] = useFeatureFlags();

  if (loading || !featureFlags) {
    return [defaultValue, loading];
  }

  return [featureFlags.get(featureFlag, defaultValue), loading];
}

export function useLegacyBooleanFeatureFlag(
  featureFlag: string,
  defaultValue: boolean,
): [boolean, boolean] {
  const [featureFlags, loading] = useFeatureFlags();

  if (loading || !featureFlags) {
    return [defaultValue, loading];
  }

  const value = featureFlags.get(featureFlag, defaultValue ? 'enabled' : 'disabled');

  return [value === 'enabled' ? true : false, loading];
}

export function useBooleanFeatureFlag(
  featureFlag: string,
  defaultValue?: boolean,
): [boolean, boolean] {
  const [featureFlags, loading] = useFeatureFlags();

  if (loading || !featureFlags) {
    return [defaultValue ?? false, loading];
  }

  const value = featureFlags.get(featureFlag, defaultValue ? 'true' : 'false');

  return [value === 'true' ? true : false, loading];
}

export function useBooleanFeatureFlagSilent(
  featureFlag: string,
  defaultValue?: boolean,
): [boolean, boolean] {
  const [featureFlags, loading] = useFeatureFlags('silent');

  if (loading || !featureFlags) {
    return [defaultValue ?? false, loading];
  }

  const value = featureFlags.get(featureFlag, defaultValue ? 'true' : 'false');

  return [value === 'true' ? true : false, loading];
}

export function useNumericFeatureFlag(
  featureFlag: string,
  defaultValue: number,
): [number, boolean] {
  const [featureFlags, loading] = useFeatureFlags();

  if (loading || !featureFlags) {
    return [defaultValue, loading];
  }

  const value = featureFlags.get(featureFlag, defaultValue.toString());

  return [Number(value), loading];
}

export function useObjectFeatureFlag<T>(
  featureFlag: string,
  defaultValue: T,
): [T, boolean] {
  const [featureFlags, loading] = useFeatureFlags();

  const value = useMemo<Nullable<T>>(() => {
    if (loading || !featureFlags) {
      return null;
    }

    const newVal = featureFlags.get(featureFlag);
    if (!newVal) {
      return null;
    }

    return JSON.parse(newVal);
  }, [featureFlags, featureFlag, loading]);

  return [value ?? defaultValue, loading];
}

export interface FeatureFlagMockProps {
  flags?: FeatureFlagState[];
}

export function MockFeatureFlagProvider({
  children,
  flags: initFlags = [],
}: WithChildren<FeatureFlagMockProps>) {
  const [flags] = useState(() => new MockedFeatureFlags(initFlags));

  return (
    <Context.Provider
      value={{
        flags,
        loading: false,
      }}
    >
      {children}
    </Context.Provider>
  );
}
