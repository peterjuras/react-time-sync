import { mount } from "enzyme";

import React from "react";
import PropTypes from "prop-types";
import { useTime } from "./use-time";
import TimeSync from "time-sync";
import lolex from "lolex";
import TimeProvider from "./time-provider";

describe("#useTime", () => {
  let clock;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
  });

  it("should be exported correctly", () => expect(useTime).toBeDefined());

  it("should throw if context is not found", () => {
    function TestComponent() {
      const time = useTime();
      return <div>{time}</div>;
    }
    expect(() => {
      const ref = mount(<TestComponent />);
      ref.unmount();
    }).toThrowErrorMatchingSnapshot();
  });

  it("should respect prop updates", () => {
    let renderCalledCount = 0;

    function TestComponent({ unit, interval }) {
      renderCalledCount++;
      const time = useTime({ unit, interval });

      return <div>{time}</div>;
    }
    TestComponent.propTypes = {
      unit: PropTypes.number,
      interval: PropTypes.string
    };
    TestComponent.defaultProps = {
      unit: undefined,
      interval: undefined
    };

    const ref = mount(
      <TimeProvider>
        <TestComponent />
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
