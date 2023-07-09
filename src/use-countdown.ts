import { useContext, useEffect, useDebugValue } from "react";
import TimeContext from "./context";
import { Interval } from "time-sync/constants";
import { useStateWithDeps } from "use-state-with-deps";

export interface PartialCountdownConfig {
  until?: number;
  interval?: Interval;
}

export interface CountdownConfig extends PartialCountdownConfig {
  until: number;
}

function getUsableConfig(
  countdownConfig: PartialCountdownConfig,
): CountdownConfig {
  return {
    ...countdownConfig,
    until: countdownConfig.until || 0,
  };
}

export function useCountdown(
  countdownConfig: PartialCountdownConfig = {},
): number {
  const timeSync = useContext(TimeContext);
  const usableConfig = getUsableConfig(countdownConfig);

  const [timeLeft, setTimeLeft] = useStateWithDeps(() => {
    return timeSync.getTimeLeft({
      interval: usableConfig.interval,
      until: usableConfig.until,
    });
  }, [usableConfig.interval, usableConfig.until]);

  useEffect((): (() => void) | void => {
    if (Date.now() < usableConfig.until) {
      return timeSync.createCountdown((newTimeLeft): void => {
        setTimeLeft(newTimeLeft);
      }, usableConfig);
    }
  }, [usableConfig.until, usableConfig.interval]);

  useDebugValue(timeLeft);
  return timeLeft;
}
