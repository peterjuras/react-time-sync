import { useContext, useDebugValue, useEffect, useRef } from "react";
import TimeContext from "./context";
import { Interval } from "time-sync/constants";
import { useForceUpdate } from "./use-force-update";

export interface TimerConfig {
  interval?: Interval;
  unit?: number;
}

export function useTime(timerConfig: TimerConfig = {}): number {
  const timeSync = useContext(TimeContext);
  const forceUpdate = useForceUpdate();

  const lastConfig = useRef(timerConfig);
  const time = useRef(timeSync.getCurrentTime(timerConfig));

  if (
    timerConfig.interval !== lastConfig.current.interval ||
    timerConfig.unit !== lastConfig.current.unit
  ) {
    lastConfig.current = timerConfig;

    time.current = timeSync.getCurrentTime(timerConfig);
  }

  useEffect(
    (): (() => void) =>
      timeSync.addTimer((currentTime): void => {
        time.current = currentTime;
        forceUpdate();
      }, lastConfig.current),
    [lastConfig.current.unit, lastConfig.current.interval]
  );

  useDebugValue(time.current);
  return time.current;
}
