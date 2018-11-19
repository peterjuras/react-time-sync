import { useContext, useEffect, useMemo, useState } from "react";
import TimeContext from "./context";

export function useCountdown(countdownConfig = {}) {
  const timeSync = useContext(TimeContext);
  if (!timeSync) {
    throw new Error(
      "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
    );
  }

  const inputs = [countdownConfig.until, countdownConfig.interval];
  let propsChanged = false;
  const usedCountdownConfig = useMemo(() => {
    propsChanged = true;
    return {
      ...countdownConfig,
      until: countdownConfig.until || 0
    };
  }, inputs);

  const [timeLeft, setTimeLeft] = useState(() =>
    timeSync.getTimeLeft(usedCountdownConfig)
  );

  const usableTimeLeft = propsChanged
    ? timeSync.getTimeLeft(usedCountdownConfig)
    : timeLeft;

  useEffect(() => {
    let stopCountdown;
    if (usableTimeLeft > 0) {
      stopCountdown = timeSync.createCountdown(
        setTimeLeft,
        usedCountdownConfig
      );
    }
    return stopCountdown;
  }, inputs);

  return usableTimeLeft;
}
