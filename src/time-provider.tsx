import React, { Component, ReactElement } from "react";
import PropTypes from "prop-types";
import TimeContext, { TimeSyncContext } from "./context";
import TimeSync from "time-sync";

interface TimeProviderProps {
  children: ReactElement | ReactElement[];
  timeSync: TimeSync;
}

interface TimeProviderState {
  customTimeSync: boolean;
  timeSync: TimeSync;
  timeContext: TimeSyncContext;
}

export default class TimeProvider extends Component<
  TimeProviderProps,
  TimeProviderState
> {
  public static propTypes = {
    children: PropTypes.node,
    timeSync: PropTypes.object
  };

  public static defaultProps = {
    children: null,
    timeSync: null
  };

  public constructor(props: TimeProviderProps) {
    super(props);

    const timeSync = props.timeSync || new TimeSync();
    this.state = {
      timeSync,
      customTimeSync: !!props.timeSync,
      timeContext: {
        getCurrentTime: TimeSync.getCurrentTime,
        getTimeLeft: TimeSync.getTimeLeft,
        addTimer: timeSync.addTimer,
        createCountdown: timeSync.createCountdown
      }
    };
  }

  public componentWillUnmount(): void {
    const { customTimeSync, timeSync } = this.state;

    if (!customTimeSync) {
      timeSync.removeAllTimers();
      timeSync.stopAllCountdowns();
    }
  }

  public render(): JSX.Element {
    const { timeContext } = this.state;
    const { children } = this.props;

    return (
      <TimeContext.Provider value={timeContext}>
        {children}
      </TimeContext.Provider>
    );
  }
}
