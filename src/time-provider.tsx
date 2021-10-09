import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import TimeContext from "./context";
import TimeSync from "time-sync";

interface TimeProviderProps {
  children?: ReactNode;
  timeSync?: TimeSync;
}

const TimeProvider: React.FC<TimeProviderProps> = (props) => {
  const timeSyncFallback = useRef<TimeSync | null>(null);
  if (!props.timeSync && !timeSyncFallback.current) {
    timeSyncFallback.current = new TimeSync();
  }
  const timeSync = props.timeSync || (timeSyncFallback.current as TimeSync);

  const timeContext = useMemo(
    () => ({
      getCurrentTime: TimeSync.getCurrentTime,
      getTimeLeft: TimeSync.getTimeLeft,
      addTimer: timeSync.addTimer,
      createCountdown: timeSync.createCountdown,
    }),
    [timeSync]
  );

  useEffect(() => {
    return () => {
      if (!props.timeSync) {
        timeSync.removeAllTimers();
        timeSync.stopAllCountdowns();
      }
    };
  }, [props.timeSync, timeSync]);

  return (
    <TimeContext.Provider value={timeContext}>
      {props.children}
    </TimeContext.Provider>
  );
};

TimeProvider.propTypes = {
  children: PropTypes.node,
  timeSync: PropTypes.object as unknown as React.Validator<
    TimeSync | undefined
  >,
};

export default TimeProvider;
