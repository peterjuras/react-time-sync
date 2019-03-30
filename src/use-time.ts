import { useContext, useDebugValue, useEffect, useRef, useState } from "react";
import TimeContext from "./context";
import { Interval } from "time-sync/constants";

export interface TimerConfig {
  interval?: Interval;
  unit?: number;
}

export function useTime(timerConfig: TimerConfig = {}): number {
  const timeSync = useContext(TimeContext);

  const lastConfig = useRef(timerConfig);
  const timeState = useState(() => timeSync.getCurrentTime(timerConfig));
  let [time] = timeState;
  const [, setTime] = timeState;

  if (
    timerConfig.interval !== lastConfig.current.interval ||
    timerConfig.unit !== lastConfig.current.unit
  ) {
    lastConfig.current = timerConfig;

    time = timeSync.getCurrentTime(timerConfig);
    setTime(time);
  }

  useEffect(() => timeSync.addTimer(setTime, lastConfig.current), [
    lastConfig.current.unit,
    lastConfig.current.interval
  ]);

  useDebugValue(time);
  return time;
}
