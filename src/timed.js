import React, { Component } from "react";
import PropTypes from "prop-types";
import TimeContext, { TIMESYNC_PROP } from "./context";

function isTimerFinished(timeSync, currentTime, timerConfig) {
  if (!timerConfig.until) {
    return false;
  }

  if (typeof timerConfig.until === "function") {
    return timerConfig.until(currentTime);
  }

  return timeSync.getCurrentTime(timerConfig) >= timerConfig.until;
}

function getTimerConfig(props) {
  const newTimerConfig = {};

  if (props.interval !== null) {
    newTimerConfig.interval = props.interval;
  }

  if (props.unit !== null) {
    newTimerConfig.unit = props.unit;
  }

  if (props.until !== null) {
    newTimerConfig.until = props.until;
  }

  return newTimerConfig;
}

function hasTimerConfigChanged(oldConfig, newConfig) {
  if (!oldConfig) {
    return true;
  }

  const oldKeys = Object.keys(oldConfig);
  if (oldKeys.length !== Object.keys(newConfig).length) {
    return true;
  }

  return oldKeys.some(key => newConfig[key] !== oldConfig[key]);
}

class Timed extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    unit: PropTypes.number,
    interval: PropTypes.string,
    until: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
  };

  static defaultProps = {
    unit: null,
    interval: null,
    until: null
  };

  constructor(props) {
    super(props);

    if (!props[TIMESYNC_PROP]) {
      throw new Error(
        "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
      );
    }
  }

  state = {};

  componentDidMount() {
    this.resetTimer();
    this.removeTimerIfNecessary();
  }

  componentDidUpdate(prevProps, prevState) {
    const { timerConfig } = this.state;

    if (prevState.timerConfig !== timerConfig) {
      this.resetTimer();
    }

    this.removeTimerIfNecessary();
  }

  componentWillUnmount() {
    if (this.removeTimer) {
      this.removeTimer();
      this.removeTimer = null;
    }
  }

  onTimerTick = currentTime => {
    this.setState({ currentTime });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const timerConfig = getTimerConfig(nextProps);
    const hasChanged = hasTimerConfigChanged(
      prevState.timerConfig,
      timerConfig
    );

    if (hasChanged) {
      return {
        timerConfig,
        currentTime: nextProps[TIMESYNC_PROP].getCurrentTime(timerConfig)
      };
    }

    return null;
  }

  resetTimer() {
    const { timerConfig } = this.state;

    const { [TIMESYNC_PROP]: timeSync } = this.props;

    if (this.removeTimer) {
      this.removeTimer();
      this.removeTimer = null;
    }

    this.removeTimer = timeSync.addTimer(this.onTimerTick, timerConfig);
  }

  removeTimerIfNecessary() {
    const { [TIMESYNC_PROP]: timeSync } = this.props;
    const { currentTime, timerConfig } = this.state;

    if (
      this.removeTimer &&
      isTimerFinished(timeSync, currentTime, timerConfig)
    ) {
      this.removeTimer();
      this.removeTimer = null;
    }
  }

  render() {
    const { [TIMESYNC_PROP]: timeSync, children } = this.props;
    const { currentTime, timerConfig } = this.state;

    return children({
      currentTime,
      finished: isTimerFinished(timeSync, currentTime, timerConfig)
    });
  }
}

export default function TimedWrapper(props) {
  return (
    <TimeContext.Consumer>
      {timeSync => <Timed {...{ ...props, [TIMESYNC_PROP]: timeSync }} />}
    </TimeContext.Consumer>
  );
}
