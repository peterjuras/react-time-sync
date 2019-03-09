import React from "react";
import TimeProvider from "./time-provider";
import TimeSync from "time-sync";
import Countdown from "./countdown";
import lolex from "lolex";
import { render, cleanup } from "react-testing-library";

describe("#Countdown", () => {
  let clock: lolex.InstalledClock<lolex.Clock>;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
    cleanup();
  });

  it("should be exported correctly", () => expect(Countdown).toBeDefined());

  it("should mount and unmount correctly", () => {
    const { unmount } = render(
      <TimeProvider>
        <Countdown>{() => <div />}</Countdown>
      </TimeProvider>
    );
    unmount();
  });

  it("should throw if context is not found", () => {
    expect(() => {
      render(<Countdown until={0}>{() => <div />}</Countdown>);
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not break if no children are passed down", () => {
    render(
      <TimeProvider>
        <Countdown />
      </TimeProvider>
    );
  });

  it("should not update when until number is reached", () => {
    clock.tick(999);
    let renderCalledCount = 0;
    const { asFragment, unmount } = render(
      <TimeProvider>
        <Countdown until={1}>
          {({ timeLeft }) => {
            renderCalledCount++;
            return <div>{timeLeft}</div>;
          }}
        </Countdown>
      </TimeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
    clock.tick(10000);
    expect(asFragment()).toMatchSnapshot();
    unmount();
    expect(renderCalledCount).toBe(1);
  });

  it("should stop countdown if it has ended", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];
    const { asFragment, unmount } = render(
      <TimeProvider>
        <Countdown until={5002}>
          {({ timeLeft }) => {
            renderCalledCount++;
            timeLefts.push(timeLeft);
            return <div>{timeLeft}</div>;
          }}
        </Countdown>
      </TimeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
    clock.tick(5001);
    expect(asFragment()).toMatchSnapshot();
    unmount();
    expect(renderCalledCount).toBe(7);
    expect(timeLefts).toEqual([6, 5, 4, 3, 2, 1, 0]);
  });

  it("should update countdown if props are updated", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];
    const { rerender } = render(
      <TimeProvider>
        <Countdown until={2001}>
          {({ timeLeft }) => {
            renderCalledCount++;
            timeLefts.push(timeLeft);
            return <div>{timeLeft}</div>;
          }}
        </Countdown>
      </TimeProvider>
    );
    clock.tick(5000);
    expect(renderCalledCount).toBe(3);
    rerender(
      <TimeProvider>
        <Countdown until={15000}>
          {({ timeLeft }) => {
            renderCalledCount++;
            timeLefts.push(timeLeft);
            return <div>{timeLeft}</div>;
          }}
        </Countdown>
      </TimeProvider>
    );
    clock.tick(20000);
    expect(renderCalledCount).toBe(14);
    expect(timeLefts).toEqual([2, 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });

  it("should use the interval provided as a prop", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];
    render(
      <TimeProvider>
        <Countdown until={1000 * 60 * 60 * 2} interval={TimeSync.HOURS}>
          {({ timeLeft }) => {
            renderCalledCount++;
            timeLefts.push(timeLeft);
            return <div>{timeLeft}</div>;
          }}
        </Countdown>
      </TimeProvider>
    );
    clock.tick(1000 * 60 * 60 * 4);
    expect(renderCalledCount).toBe(3);
    expect(timeLefts).toEqual([2, 1, 0]);
  });
});
