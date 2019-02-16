import { TimerConfig } from "./timed";
import { SafeCountdownConfig } from "./countdown";

export function hasConfigChanged(
  oldConfig: TimerConfig | SafeCountdownConfig,
  newConfig: TimerConfig | SafeCountdownConfig
): boolean {
  const oldKeys = Object.keys(oldConfig);
  if (oldKeys.length !== Object.keys(newConfig).length) {
    return true;
  }

  return oldKeys.some(key => newConfig[key] !== oldConfig[key]);
}
