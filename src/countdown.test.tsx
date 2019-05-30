import React from "react";
import TimeSync from "time-sync";
import Countdown from "./countdown";
import lolex from "lolex";
import { act, render, cleanup } from "@testing-library/react";
import { actTicks } from "../test/util";

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
    const { unmount } = render(<Countdown>{() => <div />}</Countdown>);
    unmount();
  });

  it("should not break if no children are passed down", () => {
    render(<Countdown />);
  });

  it("should not update when until number is reached", () => {
    clock.tick(999);
    let renderCalledCount = 0;
    const { asFragment, unmount } = render(
      <Countdown until={1}>
        {({ timeLeft }) => {
          renderCalledCount++;
          return <div>{timeLeft}</div>;
        }}
      </Countdown>
    );
    expect(asFragment()).toMatchSnapshot();
    actTicks(act, clock, 1000, 10);
    expect(asFragment()).toMatchSnapshot();
    unmount();
    expect(renderCalledCount).toBe(1);
  });

  it("should stop countdown if it has ended", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];
    const { asFragment, unmount } = render(
      <Countdown until={5002}>
        {({ timeLeft }) => {
          renderCalledCount++;
          timeLefts.push(timeLeft);
          return <div>{timeLeft}</div>;
        }}
      </Countdown>
    );
    expect(asFragment()).toMatchSnapshot();
    actTicks(act, clock, 1000, 6);
    expect(asFragment()).toMatchSnapshot();
    unmount();
    expect(renderCalledCount).toBe(7);
    expect(timeLefts).toEqual([6, 5, 4, 3, 2, 1, 0]);
  });

  it("should update countdown if props are updated", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];
    const { rerender } = render(
      <Countdown until={2001}>
        {({ timeLeft }) => {
          renderCalledCount++;
          timeLefts.push(timeLeft);
          return <div>{timeLeft}</div>;
        }}
      </Countdown>
    );
    actTicks(act, clock, 1000, 5);
    expect(renderCalledCount).toBe(3);
    rerender(
      <Countdown until={15000}>
        {({ timeLeft }) => {
          renderCalledCount++;
          timeLefts.push(timeLeft);
          return <div>{timeLeft}</div>;
        }}
      </Countdown>
    );
    actTicks(act, clock, 1000, 20);
    expect(renderCalledCount).toBe(14);
    expect(timeLefts).toEqual([2, 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });

  it("should use the interval provided as a prop", () => {
    let renderCalledCount = 0;
    const timeLefts: number[] = [];
    render(
      <Countdown until={1000 * 60 * 60 * 2} interval={TimeSync.HOURS}>
        {({ timeLeft }) => {
          renderCalledCount++;
          timeLefts.push(timeLeft);
          return <div>{timeLeft}</div>;
        }}
      </Countdown>
    );
    actTicks(act, clock, 1000 * 60 * 60, 4);
    expect(renderCalledCount).toBe(3);
    expect(timeLefts).toEqual([2, 1, 0]);
  });
});
