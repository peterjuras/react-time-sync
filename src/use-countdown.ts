import { useContext, useEffect, useRef, useDebugValue, useState } from "react";
import TimeContext from "./context";
import { Interval } from "time-sync/constants";

export interface CountdownConfig {
  until?: number;
  interval?: Interval;
}

export interface SafeCountdownConfig extends CountdownConfig {
  until: number;
}

function getUsableConfig(
  countdownConfig: CountdownConfig
): SafeCountdownConfig {
  return {
    ...countdownConfig,
    until: countdownConfig.until || 0
  };
}

export function useCountdown(countdownConfig: CountdownConfig = {}): number {
  const timeSync = useContext(TimeContext);

  const lastConfig = useRef(countdownConfig);
  let usableConfig = getUsableConfig(lastConfig.current);

  const timeLeftState = useState(() => timeSync.getTimeLeft(usableConfig));
  let [timeLeft] = timeLeftState;
  const [, setTimeLeft] = timeLeftState;

  if (
    countdownConfig.interval !== lastConfig.current.interval ||
    countdownConfig.until !== lastConfig.current.until
  ) {
    lastConfig.current = countdownConfig;
    usableConfig = getUsableConfig(countdownConfig);

    timeLeft = timeSync.getTimeLeft(usableConfig);
    setTimeLeft(timeLeft);
  }

  useEffect(() => {
    if (timeLeft > 0) {
      return timeSync.createCountdown(setTimeLeft, usableConfig);
    }
  }, [usableConfig.until, usableConfig.interval]);

  useDebugValue(timeLeft);
  return timeLeft;
}
