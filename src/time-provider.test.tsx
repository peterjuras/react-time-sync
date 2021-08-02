import React from "react";
import TimeContext from "./context";
import TimeProvider from "./time-provider";
import PropTypes from "prop-types";
import TimeSync from "time-sync";
import { render, cleanup } from "@testing-library/react";

declare const require: any;

describe("#TimeProvider", () => {
  afterEach(cleanup);

  it("should be exported correctly", () => {
    expect(TimeProvider).toBeDefined();
  });

  it("should mount and unmount correctly", () => {
    const { unmount } = render(<TimeProvider />);
    unmount();
  });

  it("should render null when no children are provided", () => {
    const { asFragment } = render(<TimeProvider />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render a single child", () => {
    const { asFragment } = render(
      <TimeProvider>
        <div>Test</div>
      </TimeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render multiple children", () => {
    const { asFragment } = render(
      <TimeProvider>
        <div>Test1</div>
        <div>Test2</div>
        <div>Test3</div>
      </TimeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should provide timeSync context", () => {
    const Child: any = jest.fn(() => null);
    render(
      <TimeProvider>
        <TimeContext.Consumer>
          {(timeSync) => <Child timeSync={timeSync} />}
        </TimeContext.Consumer>
      </TimeProvider>
    );

    expect(Child.mock.calls[0][0].timeSync).toBeDefined();
  });

  it("should provide the getCurrentTime function in the timeSync context", () => {
    const Child: any = jest.fn(() => null);
    render(
      <TimeProvider>
        <TimeContext.Consumer>
          {(timeSync) => <Child timeSync={timeSync} />}
        </TimeContext.Consumer>
      </TimeProvider>
    );

    expect(Child.mock.calls[0][0].timeSync.getCurrentTime).toBeInstanceOf(
      Function
    );
  });

  it("should provide the addTimer function in the timeSync context", () => {
    const Child: any = jest.fn(() => null);
    render(
      <TimeProvider>
        <TimeContext.Consumer>
          {(timeSync) => <Child timeSync={timeSync} />}
        </TimeContext.Consumer>
      </TimeProvider>
    );

    expect(Child.mock.calls[0][0].timeSync.getCurrentTime).toBeInstanceOf(
      Function
    );
  });

  it("should call removeAllTimers when unmounting", () => {
    const removeAllTimers = jest.fn();
    class TimeSync {
      public removeAllTimers = removeAllTimers;
      public stopAllCountdowns = jest.fn();
    }
    jest.resetModules();
    jest.doMock("time-sync", () => TimeSync);
    const InnerTimeProvider = require("./time-provider").default;
    jest.resetModules();

    const { unmount } = render(<InnerTimeProvider />);
    unmount();

    expect(removeAllTimers).toHaveBeenCalledTimes(1);
  });

  it("should use provided timeSync instance if possible", () => {
    const addTimer = jest.fn();
    class TimeSync {
      public removeAllTimers = jest.fn();
      public stopAllCountdowns = jest.fn();
      public addTimer = addTimer;
      public revalidate = jest.fn();
      public createCountdown = jest.fn();
      public getCurrentTime = jest.fn();
      public getTimeLeft = jest.fn();
    }

    function ContextConsumer(): JSX.Element {
      return (
        <TimeContext.Consumer>
          {(timeSync) => {
            timeSync.addTimer(() => {
              // no-op
            });
            return null;
          }}
        </TimeContext.Consumer>
      );
    }

    const timeSync = new TimeSync();
    const { unmount } = render(
      <TimeProvider timeSync={timeSync}>
        <ContextConsumer />
      </TimeProvider>
    );
    unmount();

    expect(addTimer).toHaveBeenCalledTimes(1);
  });

  it("should accept default ReactProps.children type as children", () => {
    const timeSync = new TimeSync();

    const ExampleWrapper: React.FC = ({ children }) => {
      return <TimeProvider timeSync={timeSync}>{children}</TimeProvider>;
    };
    ExampleWrapper.propTypes = {
      children: PropTypes.node,
    };

    const { asFragment } = render(
      <ExampleWrapper>
        <div>Test1</div>
        <div>Test2</div>
      </ExampleWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
