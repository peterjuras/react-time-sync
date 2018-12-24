import TimeSync from "time-sync";

export { connectTime } from "./connect-time";
export { default as TimeProvider } from "./time-provider";
export { default as Timed } from "./timed";
export { default as Countdown } from "./countdown";
export { useTime } from "./use-time";
export { useCountdown } from "./use-countdown";
export const { SECONDS, MINUTES, HOURS, DAYS } = TimeSync;
