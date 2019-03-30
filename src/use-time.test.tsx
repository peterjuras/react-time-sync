import { useTime, TimerConfig } from "./use-time";
import TimeSync from "time-sync";
import lolex from "lolex";
import { act, renderHook, cleanup } from "react-hooks-testing-library";

describe("#useTime", () => {
  let clock: lolex.InstalledClock<lolex.Clock>;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
    cleanup();
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
