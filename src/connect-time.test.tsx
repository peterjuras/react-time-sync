import React from "react";
import TimeProvider from "./time-provider";
import { connectTime } from "./connect-time";
import { createMockProvider } from "../test/mock-time-provider";
import lolex from "lolex";
import { render, cleanup } from "react-testing-library";

describe("#connectTime", () => {
  let clock: lolex.Clock;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
    cleanup();
  });

  it("should be exported correctly", () => {
    expect(connectTime).toBeInstanceOf(Function);
  });

  it("should return wrapped component without any arguments", () => {
    expect(connectTime()).toBeDefined();
  });

  it("should throw for invalid timeProp", () => {
    expect(() =>
      connectTime(null, { timeProp: 23 })
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: 23.6 })
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: [] })
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: ["a"] })
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: {} })
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: { b: 1 } })
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: "" })
    ).toThrowErrorMatchingSnapshot();
  });

  it("should throw if context is not found", () => {
    const WrappedComponent = connectTime()(() => <div />);
    expect(() => {
      render(<WrappedComponent />);
    }).toThrowErrorMatchingSnapshot();
  });

  it("should pass through timerConfig to getCurrentTime", () => {
    const getCurrentTime = jest.fn();
    const MockProvider = createMockProvider({
      getCurrentTime
    });
    const timerConfig = {
      testId: 1
    };
    const WrappedComponent = connectTime(timerConfig)(() => <div />);

    render(
      <MockProvider>
        <WrappedComponent />
      </MockProvider>
    );

    expect(getCurrentTime).toHaveBeenCalledTimes(1);
    expect(getCurrentTime).toHaveBeenCalledWith(timerConfig);
  });

  it("should pass through timerConfig to addTimer", () => {
    const addTimer = jest.fn();
    const MockProvider = createMockProvider({
      addTimer
    });
    const timerConfig = {
      testId: 1
    };
    const WrappedComponent = connectTime(timerConfig)(() => <div />);

    render(
      <MockProvider>
        <WrappedComponent />
      </MockProvider>
    );

    expect(addTimer).toHaveBeenCalledTimes(1);
    expect(addTimer.mock.calls[0][1]).toBe(timerConfig);
  });

  it("should call removeTimer on componentWillUnmount", () => {
    const removeTimer = jest.fn();
    const addTimer = jest.fn(() => removeTimer);
    const MockProvider = createMockProvider({
      addTimer
    });
    const timerConfig = {
      testId: 1
    };
    const WrappedComponent = connectTime(timerConfig)(() => <div />);

    const { unmount } = render(
      <MockProvider>
        <WrappedComponent />
      </MockProvider>
    );
    expect(removeTimer).toHaveBeenCalledTimes(0);
    unmount();
    expect(removeTimer).toHaveBeenCalledTimes(1);
  });

  it("should update children on a timer tick", () => {
    const WrappedComponent = connectTime()(({ currentTime }) => (
      <div>{currentTime}</div>
    ));

    const { asFragment } = render(
      <TimeProvider>
        <WrappedComponent />
      </TimeProvider>
    );

    expect(asFragment()).toMatchSnapshot();
    clock.tick(999);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should use the specified property name for timeProp", () => {
    const EmptyComponent = jest.fn(() => null);
    const WrappedComponent = connectTime(null, { timeProp: "test1" })(
      EmptyComponent
    );

    render(
      <TimeProvider>
        <WrappedComponent />
      </TimeProvider>
    );

    expect(EmptyComponent).toHaveBeenLastCalledWith({ test1: 0 }, {});
    clock.tick(999);
    expect(EmptyComponent).toHaveBeenLastCalledWith({ test1: 1 }, {});
  });

  it("should be reusable for multiple components", () => {
    const connect = connectTime();
    const Child1 = connect(({ currentTime }) => (
      <div>Child 1: {currentTime}</div>
    ));
    const Child2 = connect(({ currentTime }) => (
      <div>Child 2: {currentTime}</div>
    ));
    const Child3 = connect(({ currentTime }) => (
      <div>Child 3: {currentTime}</div>
    ));
    const { asFragment } = render(
      <TimeProvider>
        <Child1 />
        <Child2 />
        <Child3 />
      </TimeProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
