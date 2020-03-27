import { useContext, useDebugValue, useEffect } from "react";
import TimeContext from "./context";
import { Interval } from "time-sync/constants";
import { useStateWithDeps } from "use-state-with-deps";

export interface TimerConfig {
  interval?: Interval;
  unit?: number;
}

export function useTime(timerConfig: TimerConfig = {}): number {
  const timeSync = useContext(TimeContext);
  const [time, setTime] = useStateWithDeps(
    () =>
      timeSync.getCurrentTime({
        interval: timerConfig.interval,
        unit: timerConfig.unit,
      }),
    [timerConfig.interval, timerConfig.unit]
  );

  useEffect(
    (): (() => void) =>
      timeSync.addTimer((currentTime): void => {
        setTime(currentTime);
      }, timerConfig),
    [timerConfig.unit, timerConfig.interval]
  );

  useDebugValue(time);
  return time;
}
