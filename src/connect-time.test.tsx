import React from "react";
import { connectTime } from "./connect-time";
import { createMockProvider } from "../test/mock-time-provider";
import FakeTimers from "@sinonjs/fake-timers";
import { act, render, cleanup } from "@testing-library/react";

describe("#connectTime", () => {
  let clock: FakeTimers.Clock;

  beforeEach(() => {
    // @ts-expect-error install types are too strict, see https://github.com/sinonjs/fake-timers/issues/382
    clock = FakeTimers.install({ now: 1 });
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
      connectTime(null, { timeProp: 23 } as any)
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: 23.6 } as any)
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: [] } as any)
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: ["a"] } as any)
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: {} } as any)
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: { b: 1 } } as any)
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      connectTime(null, { timeProp: "" })
    ).toThrowErrorMatchingSnapshot();
  });

  it("should pass through timerConfig to addTimer", () => {
    const addTimer = jest.fn();
    const MockProvider = createMockProvider({
      addTimer,
    });
    const timerConfig = {
      unit: 1,
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
      addTimer,
    });
    const timerConfig = {
      unit: 1,
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

    const { asFragment } = render(<WrappedComponent />);

    expect(asFragment()).toMatchSnapshot();
    act(() => {
      clock.tick(999);
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("should use the specified property name for timeProp", () => {
    const EmptyComponent = jest.fn<
      ReturnType<React.FC>,
      Parameters<React.FC<{ test1: number }>>
    >(() => null);
    const WrappedComponent = connectTime(null, { timeProp: "test1" })(
      EmptyComponent
    );

    render(<WrappedComponent />);

    expect(EmptyComponent).toHaveBeenLastCalledWith({ test1: 0 }, {});
    act(() => {
      clock.tick(999);
    });
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
      <>
        <Child1 />
        <Child2 />
        <Child3 />
      </>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
