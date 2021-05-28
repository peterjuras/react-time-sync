import { useTime, TimerConfig } from "./use-time";
import TimeSync from "time-sync";
import FakeTimers from "@sinonjs/fake-timers";
import { act, renderHook } from "@testing-library/react-hooks";

describe("#useTime", () => {
  let clock: FakeTimers.Clock;

  beforeEach(() => {
    // @ts-expect-error install types are too strict, see https://github.com/sinonjs/fake-timers/issues/382
    clock = FakeTimers.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
  });

  it("should be exported correctly", () => expect(useTime).toBeDefined());

  it("should use seconds if no timeConfig is provided", () => {
    const { result, unmount } = renderHook(() => useTime());
    expect(result.current).toBe(0);
    act(() => {
      clock.tick(5000);
    });
    expect(result.current).toBe(5);
    unmount();
  });

  it("should respect prop updates", () => {
    let renderCalledCount = 0;

    const timerConfig: TimerConfig = {};
    const { result, rerender, unmount } = renderHook(() => {
      renderCalledCount++;
      return useTime({ ...timerConfig });
    });

    expect(result.error).toBeUndefined();
    expect(result.current).toBe(0);

    act(() => {
      clock.tick(999);
    });

    expect(result.error).toBeUndefined();
    expect(result.current).toBe(1);

    act(() => {
      clock.tick(1000);
    });

    expect(result.error).toBeUndefined();
    expect(result.current).toBe(2);

    timerConfig.unit = 5;
    timerConfig.interval = TimeSync.MINUTES;

    rerender();

    expect(result.error).toBeUndefined();
    expect(result.current).toBe(0);

    act(() => {
      clock.tick(1000 * 5 * 60);
    });

    expect(result.error).toBeUndefined();
    expect(result.current).toBe(300);

    unmount();

    expect(renderCalledCount).toBe(5);
  });
});
