import { IFeatureFlags } from '@noice-com/platform-client';
import { getErrorMessage, makeLoggers, Nullable } from '@noice-com/utils';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useClient } from '../common/client';

import { useMountEffect } from './useMountEffect.hook';

const { logError } = makeLoggers('useFeatureFlags');

type HookResult = [flags: IFeatureFlags | undefined, loading: boolean];

/**
 * Hook providing current feature flag state for the user using
 * platform-client. Will re-render on updates.
 *
 * @todo Even if the values are already cached, it will still cause
 * a re-render due to there not being a syncronous API for getting
 * the currently cached feature flag state.
 * @returns {HookResult} The current feature flag state.
 */
export function useFeatureFlags(): HookResult {
  const client = useClient();
  const [flags, setFlags] = useState<IFeatureFlags>();
  const mounted = useRef(true);

  useMountEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

  useEffect(() => {
    return client.FeatureFlagService.onFeatureFlagsUpdate(setFlags);
  }, [client]);

  useEffect(() => {
    if (!client.auth?.uid) {
      return;
    }

    const fetchFlags = async () => {
      try {
        const flags = await client.FeatureFlagService.getFeatureFlags();
        if (mounted.current) {
          setFlags(flags);
        }
      } catch (err) {
        const error = getErrorMessage(err);
        logError(`Error getting feature flags: ${error}`);
      }
    };

    fetchFlags();
  }, [client]);

  return [flags, typeof flags === 'undefined'];
}

type SingularHookResult<T> = [flagValue: T | null, loading: boolean];

/**
 * Hook providing the current string value of a given feature flag, defaulting
 * to the provided defaultValue.  Will re-render on updates.
 *
 * @todo Even if the values are already cached, it will still cause
 * a re-render due to there not being a syncronous API for getting
 * the currently cached feature flag state.
 * @returns {SingularHookResult<string>} The current feature flag state.
 */
export function useStringFeatureFlag(
  featureFlag: string,
  defaultValue: string,
): SingularHookResult<string> {
  const [flags, loading] = useFeatureFlags();

  if (loading || !flags) {
    return [defaultValue, loading];
  }

  return [flags.get(featureFlag, defaultValue), loading];
}

/**
 * Hook providing the current boolean value of a given feature flag, defaulting
 * to the provided defaultValue.  Will re-render on updates.
 *
 * @todo Even if the values are already cached, it will still cause
 * a re-render due to there not being a syncronous API for getting
 * the currently cached feature flag state.
 * @returns {SingularHookResult<boolean>} The current feature flag state.
 */
export function useBooleanFeatureFlag(
  featureFlag: string,
  defaultValue = false,
): SingularHookResult<boolean> {
  const [flags, loading] = useFeatureFlags();

  if (loading || !flags) {
    return [defaultValue, loading];
  }

  const flagValue = flags.get(featureFlag, defaultValue ? 'true' : 'false');

  return [flagValue === 'true', loading];
}

/**
 * Hook providing the current numeric value of a given feature flag, defaulting
 * to the provided defaultValue.  Will re-render on updates.
 *
 * @todo Even if the values are already cached, it will still cause
 * a re-render due to there not being a syncronous API for getting
 * the currently cached feature flag state.
 * @returns {SingularHookResult<number>} The current feature flag state.
 */
export function useNumericFeatureFlag(
  featureFlag: string,
  defaultValue: number,
): SingularHookResult<number> {
  const [flags, loading] = useFeatureFlags();

  if (loading || !flags) {
    return [defaultValue, loading];
  }

  const flagValue = flags.get(featureFlag, defaultValue.toString());

  return [Number(flagValue), loading];
}

/**
 * Hook providing the current object value of a given feature flag, defaulting
 * to the provided defaultValue.  Will re-render on updates.
 *
 * @todo Even if the values are already cached, it will still cause
 * a re-render due to there not being a syncronous API for getting
 * the currently cached feature flag state.
 * @returns {SingularHookResult<object>} The current feature flag state.
 */
export function useObjectFeatureFlag<T>(
  featureFlag: string,
  defaultValue: T,
): SingularHookResult<T> {
  const [flags, loading] = useFeatureFlags();

  const value = useMemo<Nullable<T>>(() => {
    if (loading || !flags) {
      return null;
    }

    const newVal = flags.get(featureFlag);
    if (!newVal) {
      return null;
    }

    return JSON.parse(newVal);
  }, [flags, featureFlag, loading]);

  return [value ?? defaultValue, loading];
}
