import { mount } from "enzyme";

import React from "react";
import Timed from "./timed";
import TimeSync from "time-sync";
import lolex from "lolex";
import TimeProvider from "./time-provider";

describe("#Timed", () => {
  let clock;

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

  it("should respect prop updates", () => {
    let renderCalledCount = 0;

    const ref = mount(
      <TimeProvider>
        <Timed>
          {({ currentTime }) => {
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

  it("should not update when until number is reached", () => {
    clock.tick(999);

    let renderCalledCount = 0;

    const ref = mount(
      <TimeProvider>
        <Timed until={1}>
          {({ currentTime, finished }) => {
            renderCalledCount++;
            return (
              <div>
                {currentTime}
                {`${finished}`}
              </div>
            );
          }}
        </Timed>
      </TimeProvider>
    );

    expect(ref).toMatchSnapshot();

    clock.tick(1000);

    ref.update();
    expect(ref).toMatchSnapshot();

    ref.unmount();

    expect(renderCalledCount).toBe(1);
  });

  it("should not update when until function returns true", () => {
    clock.tick(999);

    let renderCalledCount = 0;

    const ref = mount(
      <TimeProvider>
        <Timed until={currentTime => currentTime === 5}>
          {({ currentTime, finished }) => {
            renderCalledCount++;
            return (
              <div>
                {currentTime}
                {`${finished}`}
              </div>
            );
          }}
        </Timed>
      </TimeProvider>
    );

    expect(ref).toMatchSnapshot();

    clock.tick(10000);

    ref.update();
    expect(ref).toMatchSnapshot();

    ref.unmount();

    expect(renderCalledCount).toBe(5);
  });
});
