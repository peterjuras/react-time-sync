import {
  DAYS,
  HOURS,
  MINUTES,
  SECONDS,
  TimeProvider,
  Timed,
  Countdown,
  connectTime
} from "./index";

describe("#index", () => {
  it("should export connectTime correctly", () => {
    expect(connectTime).toBeInstanceOf(Function);
  });

  it("should export TimeProvider correctly", () => {
    expect(TimeProvider).toBeDefined();
  });

  it("should export Timed correctly", () => {
    expect(Timed).toBeDefined();
  });

  it("should export Countdown correctly", () => {
    expect(Countdown).toBeDefined();
  });

  it("should export SECONDS correctly", () => {
    expect(SECONDS).toBeDefined();
  });

  it("should export MINUTES correctly", () => {
    expect(MINUTES).toBeDefined();
  });

  it("should export HOURS correctly", () => {
    expect(HOURS).toBeDefined();
  });

  it("should export DAYS correctly", () => {
    expect(DAYS).toBeDefined();
  });
});
