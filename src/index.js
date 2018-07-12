import TimeSync from "time-sync";

export { connectTime } from "./connect-time";
export { default as TimeProvider } from "./time-provider";
export { default as Timed } from "./timed";
export const { SECONDS, MINUTES, HOURS, DAYS } = TimeSync;
