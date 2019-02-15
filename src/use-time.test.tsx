import React from "react";
import { useTime } from "./use-time";
import TimeSync from "time-sync";
import lolex from "lolex";
import TimeContext from "./context";
import { act, testHook, cleanup } from "react-testing-library";
import { ITimerConfig } from "./timed";

describe("#useTime", () => {
  let clock: lolex.Clock;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
    cleanup();
  });

  it("should be exported correctly", () => expect(useTime).toBeDefined());

  it("should throw if context is not found", () => {
    expect(() => testHook(() => useTime())).toThrowErrorMatchingSnapshot();
  });

  it("should respect prop updates", () => {
    let renderCalledCount = 0;

    const timeSync = new TimeSync();
    const timerConfig: ITimerConfig = {};
    const { result, rerender, unmount } = testHook(
      () => {
        renderCalledCount++;
        return useTime({ ...timerConfig });
      },
      {
        wrapper: props => (
          <TimeContext.Provider
            value={{
              getCurrentTime: TimeSync.getCurrentTime,
              getTimeLeft: TimeSync.getTimeLeft,
              addTimer: timeSync.addTimer,
              createCountdown: timeSync.createCountdown
            }}
            {...props}
          />
        )
      }
    );

    expect(result).toMatchSnapshot();

    act(() => {
      clock.tick(999);
    });
    expect(result).toMatchSnapshot();

    act(() => {
      clock.tick(1000);
    });
    expect(result).toMatchSnapshot();

    timerConfig.unit = 5;
    timerConfig.interval = TimeSync.MINUTES;

    rerender();

    expect(result).toMatchSnapshot();

    act(() => {
      clock.tick(1000 * 5 * 60);
    });

    expect(result).toMatchSnapshot();

    unmount();

    expect(renderCalledCount).toBe(6);
  });
});
