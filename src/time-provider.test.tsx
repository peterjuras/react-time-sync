import React from "react";
import TimeContext from "./context";
import TimeProvider from "./time-provider";
import TimeSync from "time-sync";
import { Timers } from "time-sync/timers";
import { render, cleanup } from "@testing-library/react";
import { Countdowns } from "time-sync/countdowns";

let pageVisible: DocumentVisibilityState | undefined = "visible";

beforeAll(() => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: function () {
      return pageVisible;
    },
  });
});

beforeEach(() => {
  pageVisible = "visible";
});

describe("#TimeProvider", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

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
      </TimeProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render multiple children", () => {
    const { asFragment } = render(
      <TimeProvider>
        <div>Test1</div>
        <div>Test2</div>
        <div>Test3</div>
      </TimeProvider>,
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
      </TimeProvider>,
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
      </TimeProvider>,
    );

    expect(Child.mock.calls[0][0].timeSync.getCurrentTime).toBeInstanceOf(
      Function,
    );
  });

  it("should provide the addTimer function in the timeSync context", () => {
    const Child: any = jest.fn(() => null);
    render(
      <TimeProvider>
        <TimeContext.Consumer>
          {(timeSync) => <Child timeSync={timeSync} />}
        </TimeContext.Consumer>
      </TimeProvider>,
    );

    expect(Child.mock.calls[0][0].timeSync.getCurrentTime).toBeInstanceOf(
      Function,
    );
  });

  it("should call removeAllTimers when unmounting", () => {
    const removeAllTimers = jest.spyOn(Timers.prototype, "removeAllTimers");

    const { unmount } = render(<TimeProvider />);
    unmount();

    expect(removeAllTimers).toHaveBeenCalledTimes(1);
  });

  it("should call stopAllCountdowns when unmounting", () => {
    const stopAllCountdowns = jest.spyOn(
      Countdowns.prototype,
      "stopAllCountdowns",
    );

    const { unmount } = render(<TimeProvider />);
    unmount();

    expect(stopAllCountdowns).toHaveBeenCalledTimes(1);
  });

  it("should use provided timeSync instance if possible", () => {
    const addTimer = jest.fn();
    const removeAllTimers = jest.spyOn(Timers.prototype, "removeAllTimers");
    const stopAllCountdowns = jest.spyOn(
      Countdowns.prototype,
      "stopAllCountdowns",
    );

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
      </TimeProvider>,
    );
    unmount();

    expect(addTimer).toHaveBeenCalledTimes(1);

    // Timers & countdowns should not be stopped for
    // custom provided TimeSync instances
    expect(stopAllCountdowns).not.toHaveBeenCalled();
    expect(removeAllTimers).not.toHaveBeenCalled();
  });

  it("should accept default ReactProps.children type as children", () => {
    const timeSync = new TimeSync();

    const ExampleWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
      children,
    }) => {
      return <TimeProvider timeSync={timeSync}>{children}</TimeProvider>;
    };

    const { asFragment } = render(
      <ExampleWrapper>
        <div>Test1</div>
        <div>Test2</div>
      </ExampleWrapper>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  describe("#page visibility change", () => {
    it("should revalidate when page becomes visible again", () => {
      const revalidateAllTimers = jest.spyOn(
        Timers.prototype,
        "revalidateAllTimers",
      );
      const revalidateAllCountdowns = jest.spyOn(
        Countdowns.prototype,
        "revalidateAllCountdowns",
      );
      const Wrapper: React.FC = () => {
        return <TimeProvider />;
      };

      const { unmount } = render(<Wrapper />);

      pageVisible = "hidden";
      document.dispatchEvent(new Event("visibilitychange"));

      expect(revalidateAllCountdowns).toHaveBeenCalledTimes(0);
      expect(revalidateAllTimers).toHaveBeenCalledTimes(0);

      pageVisible = "visible";
      document.dispatchEvent(new Event("visibilitychange"));

      expect(revalidateAllCountdowns).toHaveBeenCalledTimes(1);
      expect(revalidateAllTimers).toHaveBeenCalledTimes(1);

      unmount();
    });

    it("should not revalidate when visibilityState is not supported", () => {
      const revalidateAllTimers = jest.spyOn(
        Timers.prototype,
        "revalidateAllTimers",
      );
      const revalidateAllCountdowns = jest.spyOn(
        Countdowns.prototype,
        "revalidateAllCountdowns",
      );
      const Wrapper: React.FC = () => {
        return <TimeProvider />;
      };

      pageVisible = undefined;

      const { unmount } = render(<Wrapper />);

      pageVisible = "hidden";
      document.dispatchEvent(new Event("visibilitychange"));

      expect(revalidateAllCountdowns).toHaveBeenCalledTimes(0);
      expect(revalidateAllTimers).toHaveBeenCalledTimes(0);

      pageVisible = "visible";
      document.dispatchEvent(new Event("visibilitychange"));

      expect(revalidateAllCountdowns).toHaveBeenCalledTimes(0);
      expect(revalidateAllTimers).toHaveBeenCalledTimes(0);

      unmount();
    });
  });
});
