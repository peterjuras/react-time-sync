import { useContext, useEffect, useState } from "react";
import TimeContext from "./context";

export function useTime(timerConfig = {}) {
  const timeSync = useContext(TimeContext);
  if (!timeSync) {
    throw new Error(
      "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
    );
  }

  const [time, setTime] = useState(() => timeSync.getCurrentTime(timerConfig));

  useEffect(() => timeSync.addTimer(setTime, timerConfig), [
    timerConfig.unit,
    timerConfig.interval
  ]);

  return time;
}
