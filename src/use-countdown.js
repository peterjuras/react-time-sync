import { useContext, useEffect, useState } from "react";
import TimeContext from "./context";

export function useCountdown(countdownConfig = {}) {
  const timeSync = useContext(TimeContext);
  if (!timeSync) {
    throw new Error(
      "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
    );
  }

  const usedCountdownConfig = {
    ...countdownConfig,
    until: countdownConfig.until || 0
  };

  const [timeLeft, setTimeLeft] = useState(
    timeSync.getTimeLeft(usedCountdownConfig)
  );

  useEffect(
    () => {
      const officialTimeLeft = timeSync.getTimeLeft(usedCountdownConfig);
      if (officialTimeLeft !== timeLeft) {
        setTimeLeft(officialTimeLeft);
      }

      let stopCountdown;
      if (officialTimeLeft > 0) {
        stopCountdown = timeSync.createCountdown(
          setTimeLeft,
          usedCountdownConfig
        );
      }
      return stopCountdown;
    },
    [usedCountdownConfig.until, usedCountdownConfig.interval]
  );

  return timeLeft;
}
