import { useContext, useEffect, useRef, useDebugValue, useState } from "react";
import TimeContext from "./context";
import { CountdownConfig, SafeCountdownConfig } from "./countdown";

function getUsableConfig(
  countdownConfig: CountdownConfig
): SafeCountdownConfig {
  return {
    ...countdownConfig,
    until: countdownConfig.until || 0
  };
}

export function useCountdown(countdownConfig: CountdownConfig = {}): number {
  const timeSync = useContext(TimeContext);
  if (!timeSync) {
    throw new Error(
      "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
    );
  }

  const lastConfig = useRef(countdownConfig);
  let usableConfig = getUsableConfig(lastConfig.current);

  const timeLeftState = useState(() => timeSync.getTimeLeft(usableConfig));
  let [timeLeft] = timeLeftState;
  const [, setTimeLeft] = timeLeftState;

  if (
    countdownConfig.interval !== lastConfig.current.interval ||
    countdownConfig.until !== lastConfig.current.until
  ) {
    lastConfig.current = countdownConfig;
    usableConfig = getUsableConfig(countdownConfig);

    timeLeft = timeSync.getTimeLeft(getUsableConfig(countdownConfig));
    setTimeLeft(timeLeft);
  }

  useEffect(() => {
    if (timeLeft > 0) {
      return timeSync.createCountdown(setTimeLeft, usableConfig);
    }
  }, [usableConfig.until, usableConfig.interval]);

  useDebugValue(timeLeft);
  return timeLeft;
}
