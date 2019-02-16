import { useContext, useDebugValue, useEffect, useRef, useState } from "react";
import TimeContext from "./context";
import { TimerConfig } from "./timed";

export function useTime(timerConfig: TimerConfig = {}): number {
  const timeSync = useContext(TimeContext);
  if (!timeSync) {
    throw new Error(
      "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
    );
  }

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
