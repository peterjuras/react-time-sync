import { mount, render } from "enzyme";

import React from "react";
import TimeContext from "./context";
import TimeProvider from "./time-provider";

describe("#TimeProvider", () => {
  it("should be exported correctly", () => {
    expect(TimeProvider).toBeDefined();
  });

  it("should mount and unmount correctly", () => {
    const ref = mount(<TimeProvider />);
    ref.unmount();
  });

  it("should render null when no children are provided", () => {
    const ref = render(<TimeProvider />);
    expect(ref).toMatchSnapshot();
  });

  it("should render a single child", () => {
    const ref = render(
      <TimeProvider>
        <div>Test</div>
      </TimeProvider>
    );
    expect(ref).toMatchSnapshot();
  });

  it("should render multiple children", () => {
    const ref = render(
      <TimeProvider>
        <div>Test1</div>
        <div>Test2</div>
        <div>Test3</div>
      </TimeProvider>
    );
    expect(ref).toMatchSnapshot();
  });

  it("should provide timeSync context", () => {
    const Child: any = jest.fn(() => null);
    const ref = mount(
      <TimeProvider>
        <TimeContext.Consumer>
          {timeSync => <Child timeSync={timeSync} />}
        </TimeContext.Consumer>
      </TimeProvider>
    );

    expect(Child.mock.calls[0][0].timeSync).toBeDefined();

    ref.unmount();
  });

  it("should provide the getCurrentTime function in the timeSync context", () => {
    const Child: any = jest.fn(() => null);
    const ref = mount(
      <TimeProvider>
        <TimeContext.Consumer>
          {timeSync => <Child timeSync={timeSync} />}
        </TimeContext.Consumer>
      </TimeProvider>
    );

    expect(Child.mock.calls[0][0].timeSync.getCurrentTime).toBeInstanceOf(
      Function
    );

    ref.unmount();
  });

  it("should provide the addTimer function in the timeSync context", () => {
    const Child: any = jest.fn(() => null);
    const ref = mount(
      <TimeProvider>
        <TimeContext.Consumer>
          {timeSync => <Child timeSync={timeSync} />}
        </TimeContext.Consumer>
      </TimeProvider>
    );

    expect(Child.mock.calls[0][0].timeSync.getCurrentTime).toBeInstanceOf(
      Function
    );

    ref.unmount();
  });

  it("should call removeAllTimers when unmounting", () => {
    const ref: any = mount(<TimeProvider />);
    const spy = jest.spyOn(ref.instance().state.timeSync, "removeAllTimers");
    ref.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});