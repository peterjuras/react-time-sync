import { useContext, useEffect, useMemo, useState } from "react";
import TimeContext from "./context";

export function useTime(timerConfig = {}) {
  const timeSync = useContext(TimeContext);
  if (!timeSync) {
    throw new Error(
      "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
    );
  }

  const inputs = [timerConfig.unit, timerConfig.interval];
  let propsChanged = false;
  useMemo(() => {
    propsChanged = true;
  }, inputs);

  const [time, setTime] = useState(() => timeSync.getCurrentTime(timerConfig));

  useEffect(() => timeSync.addTimer(setTime, timerConfig), inputs);

  if (propsChanged) {
    return timeSync.getCurrentTime(timerConfig);
  }

  return time;
}
