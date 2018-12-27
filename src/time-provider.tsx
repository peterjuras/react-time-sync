import React, { Component, ReactElement } from "react";
import PropTypes from "prop-types";
import TimeContext, { ITimeSyncContext } from "./context";
import TimeSync from "time-sync";

interface ITimeProviderProps {
  // children: ReactElementLike | ReactElementLike[];
  children: ReactElement<any> | Array<ReactElement<any>>;
}

interface ITimeProviderState {
  timeSync: TimeSync;
  timeContext: ITimeSyncContext;
}

export default class TimeProvider extends Component<
  ITimeProviderProps,
  ITimeProviderState
> {
  public static propTypes = {
    children: PropTypes.node
  };

  public static defaultProps = {
    children: null
  };

  constructor(props: ITimeProviderProps) {
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

  public componentWillUnmount() {
    const { timeSync } = this.state;

    timeSync.removeAllTimers();
    timeSync.stopAllCountdowns();
  }

  public render() {
    const { timeContext } = this.state;
    const { children } = this.props;

    return (
      <TimeContext.Provider value={timeContext}>
        {children}
      </TimeContext.Provider>
    );
  }
}
