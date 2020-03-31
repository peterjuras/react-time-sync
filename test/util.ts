import FakeTimers from "@sinonjs/fake-timers";

export function actTicks(
  act: (callback: () => void) => void,
  clock: FakeTimers.InstalledClock,
  interval: number,
  count: number
): void {
  for (let i = 0; i < count * 2; i++) {
    act((): void => {
      clock.tick(interval / 2);
    });
  }
}
