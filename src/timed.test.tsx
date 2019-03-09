import React from "react";
import Timed from "./timed";
import TimeSync from "time-sync";
import lolex from "lolex";
import TimeProvider from "./time-provider";
import { render, cleanup } from "react-testing-library";

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
    const { unmount } = render(
      <TimeProvider>
        <Timed>{() => <div />}</Timed>
      </TimeProvider>
    );
    unmount();
  });

  it("should throw if context is not found", () => {
    expect(() => {
      render(<Timed>{() => <div />}</Timed>);
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not break if no children are passed down", () => {
    render(
      <TimeProvider>
        <Timed />
      </TimeProvider>
    );
  });

  it("should respect prop updates", () => {
    let renderCalledCount = 0;

    const { asFragment, rerender, unmount } = render(
      <TimeProvider>
        <Timed>
          {({ currentTime }: { currentTime: number }) => {
            renderCalledCount++;
            return <div>{currentTime}</div>;
          }}
        </Timed>
      </TimeProvider>
    );

    expect(asFragment()).toMatchSnapshot();

    clock.tick(999);
    expect(asFragment()).toMatchSnapshot();

    clock.tick(1000);
    expect(asFragment()).toMatchSnapshot();

    const newProps = {
      unit: 5,
      interval: TimeSync.MINUTES
    };

    rerender(
      <TimeProvider>
        <Timed {...newProps}>
          {({ currentTime }: { currentTime: number }) => {
            renderCalledCount++;
            return <div>{currentTime}</div>;
          }}
        </Timed>
      </TimeProvider>
    );

    expect(asFragment()).toMatchSnapshot();

    clock.tick(1000 * 5 * 60);

    expect(asFragment()).toMatchSnapshot();

    unmount();

    expect(renderCalledCount).toBe(5);
  });
});
