import { SetTimeoutId } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useRef } from 'react';

import { AlertsList } from '../types';

interface Props {
  renderedAlerts: AlertsList;
  onAlertCompleted(id: string): void;
}

export function useCurrentAlertDuration({ renderedAlerts, onAlertCompleted }: Props) {
  const alertDurationTimeoutRef = useRef<Nullable<SetTimeoutId>>(null);
  const currentAlertIdRef = useRef<Nullable<string>>(null);

  useEffect(() => {
    const clearAlertDurationTimeoutRef = () => {
      if (alertDurationTimeoutRef.current) {
        clearTimeout(alertDurationTimeoutRef.current);
        alertDurationTimeoutRef.current = null;
      }
    };

    if (!renderedAlerts.length) {
      clearAlertDurationTimeoutRef();
      currentAlertIdRef.current = null;
      return;
    }

    const currentHighlight = renderedAlerts[renderedAlerts.length - 1];

    if (currentAlertIdRef.current !== currentHighlight.id && currentHighlight.duration) {
      clearAlertDurationTimeoutRef();
      currentAlertIdRef.current = currentHighlight.id;

      alertDurationTimeoutRef.current = setTimeout(() => {
        clearAlertDurationTimeoutRef();
        onAlertCompleted(currentHighlight.id);
      }, currentHighlight.duration);
    }
  }, [renderedAlerts, onAlertCompleted]);
}
