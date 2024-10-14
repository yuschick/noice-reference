import { Nullable } from '@noice-com/utils';
import { useCallback, useMemo, useRef, useState } from 'react';

import { AlertsList, AlertProps } from '../types';

const shouldKeepAlert = (alerts: AlertsList, alert: AlertProps) => {
  if (!alert.keepLast) {
    return false;
  }

  const keptAlerts = alerts.filter(
    (existing) => existing.keepLast && existing.id !== alert.id,
  );

  if (keptAlerts.length) {
    return false;
  }

  return true;
};

const keepAlert = (alerts: AlertsList, alert: AlertProps) => {
  alert.keepDate = new Date();

  return [...alerts.filter((existing) => existing.id !== alert.id), alert];
};

interface HookResult {
  alerts: AlertsList;
  actions: {
    addAlert(alert: AlertProps): void;
    removeByTypeName(typeName: string, fromIndex: number): void;
    removeById(id: string): void;
    completeAlert(id: string): void;
    getCurrentAlert(): Nullable<AlertProps>;
    getAlertById(id: string): Nullable<AlertProps>;
  };
}

export function useAlertsList(): HookResult {
  const [alerts, setAlerts] = useState<AlertsList>([]);
  const alertsRef = useRef<AlertsList>([]);

  const getCurrentAlert = useCallback((): Nullable<AlertProps> => {
    return alertsRef.current.length ? alertsRef.current[0] : null;
  }, []);

  const getAlertById = useCallback((id: string): Nullable<AlertProps> => {
    return alertsRef.current.find((alert) => alert.id === id) ?? null;
  }, []);

  const removeById = useCallback((id: string) => {
    alertsRef.current = alertsRef.current.filter((alert) => alert.id !== id);

    setAlerts(alertsRef.current);
  }, []);

  const removeByTypeName = useCallback((typeName: string, fromIndex = 0) => {
    alertsRef.current = alertsRef.current.filter(
      (alert, index) =>
        index < fromIndex || (index >= fromIndex && alert.data.__typename !== typeName),
    );

    setAlerts(alertsRef.current);
  }, []);

  const completeAlert = useCallback(
    (id: string) => {
      const highlight = alertsRef.current.find(
        (existingHighlight) => existingHighlight.id === id,
      );

      if (!highlight) {
        return;
      }

      if (!shouldKeepAlert(alertsRef.current, highlight)) {
        removeById(id);
        return;
      }

      alertsRef.current = keepAlert(alertsRef.current, highlight);
      setAlerts(alertsRef.current);
    },
    [removeById],
  );

  const addAlert = useCallback((alert: AlertProps) => {
    const keepFirstSortRest = (alerts: AlertsList, addedAlert: AlertProps) => {
      if (alerts.find((alert) => alert.id === addedAlert.id)) {
        return [...alerts];
      }

      if (!alerts.length) {
        return [addedAlert];
      }

      if (alerts.length === 1) {
        return [alerts[0], addedAlert];
      }

      const rest = [...alerts.slice(1), addedAlert];

      const sametype = rest.filter(
        (existing) => addedAlert.data.__typename === existing.data.__typename,
      );

      if (sametype.length > addedAlert.maxAmount) {
        sametype.splice(0, sametype.length - addedAlert.maxAmount);
      }

      const others = rest.filter(
        (existing) => existing.data.__typename !== addedAlert.data.__typename,
      );

      return [
        alerts[0],
        ...[...sametype, ...others].sort((a, b) => a.priority - b.priority),
      ];
    };

    const current = alertsRef.current.length ? alertsRef.current[0] : null;

    let newAlerts = keepFirstSortRest(alertsRef.current, alert);

    if (current && current.keepLast && current.keepDate) {
      if (shouldKeepAlert(newAlerts, current)) {
        newAlerts = keepAlert(newAlerts, current);
      } else {
        newAlerts.splice(0, 1);
      }
    }

    alertsRef.current = newAlerts;

    if (alertsRef.current.length) {
      alertsRef.current[0].keepDate = undefined;
    }

    setAlerts(alertsRef.current);
  }, []);

  const actions = useMemo(() => {
    return {
      addAlert,
      removeByTypeName,
      removeById,
      completeAlert,
      getCurrentAlert,
      getAlertById,
    };
  }, [
    addAlert,
    removeByTypeName,
    removeById,
    completeAlert,
    getCurrentAlert,
    getAlertById,
  ]);

  return {
    alerts: alerts,
    actions,
  };
}
