import React from "react";
import TimeSync from "time-sync";

export const TIMESYNC_PROP = "$$_TIME_SYNC_HIDDEN_$$";

export interface TimeSyncContext {
  getCurrentTime: typeof TimeSync.getCurrentTime;
  getTimeLeft: typeof TimeSync.getTimeLeft;
  addTimer: typeof TimeSync.prototype.addTimer;
  createCountdown: typeof TimeSync.prototype.createCountdown;
}

export default React.createContext<TimeSyncContext>(
  (null as unknown) as TimeSyncContext
);
