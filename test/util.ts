import lolex from "lolex";

export function actTicks(
  act: (callback: () => void) => void,
  clock: lolex.InstalledClock<lolex.Clock>,
  interval: number,
  count: number
): void {
  for (let i = 0; i < count * 2; i++) {
    act(() => {
      clock.tick(interval / 2);
    });
  }
}
