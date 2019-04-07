import React from "react";
import Timed from "./timed";
import TimeSync from "time-sync";
import lolex from "lolex";
import { render, cleanup, act } from "react-testing-library";
import { actTicks } from "../test/util";

describe("#Timed", () => {
  let clock: lolex.InstalledClock<lolex.Clock>;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
    cleanup();
  });

  it("should be exported correctly", () => expect(Timed).toBeDefined());

  it("should mount and unmount correctly", () => {
    const { unmount } = render(<Timed>{() => <div />}</Timed>);
    unmount();
  });

  it("should not break if no children are passed down", () => {
    render(<Timed />);
  });

  it("should respect prop updates", () => {
    let renderCalledCount = 0;

    const { asFragment, rerender, unmount } = render(
      <Timed>
        {({ currentTime }: { currentTime: number }) => {
          renderCalledCount++;
          return <div>{currentTime}</div>;
        }}
      </Timed>
    );

    expect(asFragment()).toMatchSnapshot();

    act(() => {
      clock.tick(999);
    });
    expect(asFragment()).toMatchSnapshot();

    act(() => {
      clock.tick(1000);
    });
    expect(asFragment()).toMatchSnapshot();

    const newProps = {
      unit: 5,
      interval: TimeSync.MINUTES
    };

    rerender(
      <Timed {...newProps}>
        {({ currentTime }: { currentTime: number }) => {
          renderCalledCount++;
          return <div>{currentTime}</div>;
        }}
      </Timed>
    );

    expect(asFragment()).toMatchSnapshot();

    actTicks(act, clock, 1000 * 60, 5);

    expect(asFragment()).toMatchSnapshot();

    unmount();

    expect(renderCalledCount).toBe(5);
  });
});
