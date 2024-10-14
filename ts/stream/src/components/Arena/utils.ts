import { getTier } from '../../utils/gpu';

import { BatteryStatus } from './types';

export function isOffscreenCanvasSupported() {
  return 'OffscreenCanvas' in window;
}

export function isMediaStreamVideoTrackProcessorSupported(): boolean {
  return typeof MediaStreamTrackProcessor !== 'undefined';
}

export async function getBatteryStatus(): Promise<BatteryStatus> {
  let batteryStatus = BatteryStatus.Unavailable;
  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      batteryStatus = battery.charging
        ? BatteryStatus.Charging
        : BatteryStatus.Discharging;
    } catch (e) {
      // battery API is not available
    }
  }

  return batteryStatus;
}

export function getHardwareConcurrency(): number {
  return navigator.hardwareConcurrency;
}

export async function isClientSideRenderingSupported(): Promise<boolean> {
  const hardwareConcurrency = getHardwareConcurrency();
  const batteryStatus = await getBatteryStatus();

  const gpuTierData = await getTier();
  const gpuTier = gpuTierData?.tier ?? 1;

  return (
    isMediaStreamVideoTrackProcessorSupported() &&
    hardwareConcurrency >= 16 &&
    batteryStatus === BatteryStatus.Charging &&
    gpuTier === 3
  );
}
