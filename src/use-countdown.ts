import { useContext, useEffect, useRef, useDebugValue } from "react";
import TimeContext from "./context";
import { Interval } from "time-sync/constants";
import { useForceUpdate } from "./use-force-update";

export interface PartialCountdownConfig {
  until?: number;
  interval?: Interval;
}

export interface CountdownConfig extends PartialCountdownConfig {
  until: number;
}

function getUsableConfig(
  countdownConfig: PartialCountdownConfig
): CountdownConfig {
  return {
    ...countdownConfig,
    until: countdownConfig.until || 0
  };
}

export function useCountdown(
  countdownConfig: PartialCountdownConfig = {}
): number {
  const timeSync = useContext(TimeContext);
  const forceUpdate = useForceUpdate();

  const lastConfig = useRef(countdownConfig);
  let usableConfig = getUsableConfig(lastConfig.current);

  const timeLeft = useRef(timeSync.getTimeLeft(usableConfig));

  if (
    countdownConfig.interval !== lastConfig.current.interval ||
    countdownConfig.until !== lastConfig.current.until
  ) {
    lastConfig.current = countdownConfig;
    usableConfig = getUsableConfig(countdownConfig);

    timeLeft.current = timeSync.getTimeLeft(usableConfig);
  }

  useEffect((): (() => void) | void => {
    if (timeLeft.current > 0) {
      return timeSync.createCountdown((newTimeLeft): void => {
        timeLeft.current = newTimeLeft;
        forceUpdate();
      }, usableConfig);
    }
  }, [usableConfig.until, usableConfig.interval]);

  useDebugValue(timeLeft.current);
  return timeLeft.current;
}
