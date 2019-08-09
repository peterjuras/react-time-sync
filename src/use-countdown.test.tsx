import TimeSync from "time-sync";
import { useCountdown, PartialCountdownConfig } from "./use-countdown";
import lolex from "lolex";
import { act, renderHook } from "@testing-library/react-hooks";
import { actTicks } from "../test/util";

describe("#Countdown", () => {
  let clock: lolex.InstalledClock<lolex.Clock>;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
  });

  it("should be exported correctly", () => expect(useCountdown).toBeDefined());

  it("should not update when until number is reached", () => {
    clock.tick(999);
    let renderCalledCount = 0;

    const { result, unmount } = renderHook(() => {
      renderCalledCount++;
      return useCountdown({ until: 1 });
    });
    expect(result).toMatchSnapshot();
    actTicks(act, clock, 1000, 10);
    expect(result).toMatchSnapshot();
    act(() => {
      unmount();
    });
    expect(renderCalledCount).toBe(1);
  });

  it("should stop countdown if it has ended", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];

    const { result, unmount } = renderHook(() => {
      renderCalledCount++;
      const timeLeft = useCountdown({ until: 5002 });
      timeLefts.push(timeLeft);
      return timeLeft;
    });
    expect(result).toMatchSnapshot();

    actTicks(act, clock, 1000, 6);
    expect(result).toMatchSnapshot();
    act(() => {
      unmount();
    });
    expect(renderCalledCount).toBe(7);
    expect(timeLefts).toEqual([6, 5, 4, 3, 2, 1, 0]);
  });

  it("should update countdown if props are updated", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];

    const countdownConfig: PartialCountdownConfig = {};
    const { rerender } = renderHook(() => {
      renderCalledCount++;
      const timeLeft = useCountdown({ until: countdownConfig.until || 2001 });
      timeLefts.push(timeLeft);
      return timeLeft;
    });

    actTicks(act, clock, 1000, 5);

    expect(renderCalledCount).toBe(3);
    countdownConfig.until = 15000;
    rerender();
    actTicks(act, clock, 1000, 20);
    expect(renderCalledCount).toBe(14);
    expect(timeLefts).toEqual([2, 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });

  it("should use the interval provided as a prop", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];

    renderHook(() => {
      renderCalledCount++;
      const timeLeft = useCountdown({
        until: 1000 * 60 * 60 * 2,
        interval: TimeSync.HOURS
      });
      timeLefts.push(timeLeft);
      return timeLeft;
    });
    actTicks(act, clock, 1000 * 60 * 60, 5);
    expect(renderCalledCount).toBe(3);
    expect(timeLefts).toEqual([2, 1, 0]);
  });

  it("should not start a countdown if no until value is specified", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];

    renderHook(() => {
      renderCalledCount++;
      const timeLeft = useCountdown();
      timeLefts.push(timeLeft);
      return timeLeft;
    });

    actTicks(act, clock, 1000, 10);

    expect(renderCalledCount).toBe(1);
    expect(timeLefts).toEqual([0]);
  });
});
