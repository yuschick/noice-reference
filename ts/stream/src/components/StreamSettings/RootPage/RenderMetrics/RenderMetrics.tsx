import { RadioInput } from '../../RadioInput/RadioInput';

import { useStreamSettings } from '@stream-context';

export function RenderMetrics() {
  const { metricsVisible, setMetricsVisible } = useStreamSettings();

  return (
    <>
      <RadioInput
        checked={!metricsVisible}
        label="Hidden"
        name="render-metrics"
        value="Hidden"
        onChange={() => setMetricsVisible(false)}
      />
      <RadioInput
        checked={metricsVisible}
        label="Visible"
        name="render-metrics"
        value="Visible"
        onChange={() => setMetricsVisible(true)}
      />
    </>
  );
}
