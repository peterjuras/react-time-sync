import { mount } from "enzyme";

import React from "react";
import PropTypes from "prop-types";
import TimeProvider from "./time-provider";
import TimeSync from "time-sync";
import { useCountdown } from "./use-countdown";
import lolex from "lolex";

describe("#Countdown", () => {
  let clock;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
  });

  it("should be exported correctly", () => expect(useCountdown).toBeDefined());

  it("should throw if context is not found", () => {
    function TestComponent() {
      const timeLeft = useCountdown();
      return <div>{timeLeft}</div>;
    }
    expect(() => {
      const ref = mount(<TestComponent />);
      ref.unmount();
    }).toThrowErrorMatchingSnapshot();
  });

  it("should not update when until number is reached", () => {
    clock.tick(999);
    let renderCalledCount = 0;
    function TestComponent() {
      renderCalledCount++;
      const timeLeft = useCountdown({ until: 1 });

      return <div>{timeLeft}</div>;
    }

    const ref = mount(
      <TimeProvider>
        <TestComponent />
      </TimeProvider>
    );
    expect(ref).toMatchSnapshot();
    clock.tick(10000);
    ref.update();
    expect(ref).toMatchSnapshot();
    ref.unmount();
    expect(renderCalledCount).toBe(1);
  });

  it("should stop countdown if it has ended", () => {
    let renderCalledCount = 0;
    const timeLefts = [];
    function TestComponent() {
      const timeLeft = useCountdown({ until: 5002 });
      renderCalledCount++;
      timeLefts.push(timeLeft);
      return <div>{timeLeft}</div>;
    }

    const ref = mount(
      <TimeProvider>
        <TestComponent />
      </TimeProvider>
    );
    expect(ref).toMatchSnapshot();
    clock.tick(5001);
    ref.update();
    expect(ref).toMatchSnapshot();
    ref.unmount();
    expect(renderCalledCount).toBe(7);
    expect(timeLefts).toEqual([6, 5, 4, 3, 2, 1, 0]);
  });

  it("should update countdown if props are updated", () => {
    let renderCalledCount = 0;
    const timeLefts = [];
    function TestComponent({ until }) {
      const timeLeft = useCountdown({ until: until || 2001 });
      renderCalledCount++;
      timeLefts.push(timeLeft);
      return <div>{timeLeft}</div>;
    }
    TestComponent.propTypes = {
      until: PropTypes.number
    };
    TestComponent.defaultProps = {
      until: undefined
    };

    const ref = mount(
      <TimeProvider>
        <TestComponent />
      </TimeProvider>
    );
    clock.tick(5000);
    expect(renderCalledCount).toBe(3);
    ref.setProps({
      children: React.cloneElement(ref.props().children, { until: 15000 })
    });
    clock.tick(20000);
    expect(renderCalledCount).toBe(14);
    expect(timeLefts).toEqual([2, 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    ref.unmount();
  });

  it("should use the interval provided as a prop", () => {
    let renderCalledCount = 0;
    const timeLefts = [];
    function TestComponent() {
      const timeLeft = useCountdown({
        until: 1000 * 60 * 60 * 2,
        interval: TimeSync.HOURS
      });
      renderCalledCount++;
      timeLefts.push(timeLeft);
      return <div>{timeLeft}</div>;
    }
    const ref = mount(
      <TimeProvider>
        <TestComponent />
      </TimeProvider>
    );
    clock.tick(1000 * 60 * 60 * 4);
    expect(renderCalledCount).toBe(3);
    expect(timeLefts).toEqual([2, 1, 0]);
    ref.unmount();
  });
});
