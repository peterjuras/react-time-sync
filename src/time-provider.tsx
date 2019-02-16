import React, { Component, ReactElement } from "react";
import PropTypes from "prop-types";
import TimeContext, { TimeSyncContext } from "./context";
import TimeSync from "time-sync";

interface TimeProviderProps {
  children: ReactElement | ReactElement[];
}

interface TimeProviderState {
  timeSync: TimeSync;
  timeContext: TimeSyncContext;
}

export default class TimeProvider extends Component<
  TimeProviderProps,
  TimeProviderState
> {
  public static propTypes = {
    children: PropTypes.node
  };

  public static defaultProps = {
    children: null
  };

  public constructor(props: TimeProviderProps) {
    super(props);

    const timeSync = new TimeSync();
    this.state = {
      timeSync,
      timeContext: {
        getCurrentTime: TimeSync.getCurrentTime,
        getTimeLeft: TimeSync.getTimeLeft,
        addTimer: timeSync.addTimer,
        createCountdown: timeSync.createCountdown
      }
    };
  }

  public componentWillUnmount(): void {
    const { timeSync } = this.state;

    timeSync.removeAllTimers();
    timeSync.stopAllCountdowns();
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
