import React, { Component } from "react";
import PropTypes from "prop-types";
import TimeContext from "./context";
import TimeSync from "time-sync";

export default class TimeProvider extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  static defaultProps = {
    children: null
  };

  constructor(props) {
    super(props);

    const timeSync = new TimeSync();
    this.state = {
      timeSync,
      timeContext: {
        getCurrentTime: TimeSync.getCurrentTime,
        addTimer: timeSync.addTimer
      }
    };
  }

  componentWillUnmount() {
    const { timeSync } = this.state;

    timeSync.removeAllTimers();
  }

  render() {
    const { timeContext } = this.state;
    const { children } = this.props;

    return (
      <TimeContext.Provider value={timeContext}>
        {children}
      </TimeContext.Provider>
    );
  }
}
