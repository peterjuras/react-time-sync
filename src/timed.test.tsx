import { mount } from "enzyme";

import React from "react";
import Timed from "./timed";
import TimeSync from "time-sync";
import lolex from "lolex";
import TimeProvider from "./time-provider";

describe("#Timed", () => {
  let clock: lolex.Clock;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
  });

  it("should be exported correctly", () => expect(Timed).toBeDefined());

  it("should mount and unmount correctly", () => {
    const ref = mount(
      <TimeProvider>
        <Timed>{() => <div />}</Timed>
      </TimeProvider>
    );
    ref.unmount();
  });

  it("should throw if context is not found", () => {
    expect(() => {
      const ref = mount(<Timed>{() => <div />}</Timed>);
      ref.unmount();
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not break if no children are passed down", () => {
    const ref = mount(
      <TimeProvider>
        <Timed />
      </TimeProvider>
    );
    ref.unmount();
  });

  it("should respect prop updates", () => {
    let renderCalledCount = 0;

    const ref = mount(
      <TimeProvider>
        <Timed>
          {({ currentTime }: { currentTime: number }) => {
            renderCalledCount++;
            return <div>{currentTime}</div>;
          }}
        </Timed>
      </TimeProvider>
    );

    expect(ref).toMatchSnapshot();

    clock.tick(999);
    ref.update();
    expect(ref).toMatchSnapshot();

    clock.tick(1000);
    ref.update();
    expect(ref).toMatchSnapshot();

    const newProps = {
      unit: 5,
      interval: TimeSync.MINUTES
    };

    ref.setProps({
      children: React.cloneElement(ref.props().children, newProps)
    });

    ref.update();
    expect(ref).toMatchSnapshot();

    clock.tick(1000 * 5 * 60);

    ref.update();
    expect(ref).toMatchSnapshot();

    ref.unmount();

    expect(renderCalledCount).toBe(5);
  });
});
