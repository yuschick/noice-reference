import { useEffect, useRef, useState } from 'react';

import { AlertsList } from '../types';

interface Props {
  alerts: AlertsList;
}

interface HookResult {
  renderedAlerts: AlertsList;
}

export function useRenderedAlertsList({ alerts }: Props): HookResult {
  const previousAlertsRef = useRef<AlertsList>([]);
  const disappearingAlertsRef = useRef<AlertsList>([]);
  const [renderedAlerts, setRenderedAlerts] = useState<AlertsList>([]);

  useEffect(() => {
    const previous = previousAlertsRef.current.length
      ? previousAlertsRef.current[0]
      : null;

    previousAlertsRef.current = alerts;

    const current = alerts.length ? alerts[0] : null;

    if (current) {
      current.onDisappeared = undefined;
      disappearingAlertsRef.current = disappearingAlertsRef.current.filter(
        (alert) => alert.id !== current.id,
      );
    }

    if (previous && (!current || (current && previous.id !== current.id))) {
      previous.onDisappeared = () => {
        disappearingAlertsRef.current = disappearingAlertsRef.current.filter(
          (highlight) => highlight.id !== previous.id,
        );
        setRenderedAlerts([
          ...disappearingAlertsRef.current,
          ...(previousAlertsRef.current.length ? [previousAlertsRef.current[0]] : []),
        ]);
      };

      disappearingAlertsRef.current.push(previous);
    }

    setRenderedAlerts([...disappearingAlertsRef.current, ...(current ? [current] : [])]);
  }, [alerts]);

  return { renderedAlerts };
}
