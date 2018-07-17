import React, { Component } from "react";
import PropTypes from "prop-types";
import TimeContext, { TIMESYNC_PROP } from "./context";
import { hasConfigChanged } from "./config";

function getTimerConfig(props) {
  const newTimerConfig = {};

  if (props.interval !== null) {
    newTimerConfig.interval = props.interval;
  }

  if (props.unit !== null) {
    newTimerConfig.unit = props.unit;
  }

  return newTimerConfig;
}

class Timed extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    unit: PropTypes.number,
    interval: PropTypes.string
  };

  static defaultProps = {
    unit: null,
    interval: null
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
  }

  componentDidUpdate(prevProps, prevState) {
    const { timerConfig } = this.state;

    if (prevState.timerConfig !== timerConfig) {
      this.resetTimer();
    }
  }

  componentWillUnmount() {
    this.removeTimer();
  }

  onTimerTick = currentTime => {
    this.setState({ currentTime });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const timerConfig = getTimerConfig(nextProps);
    const hasChanged = hasConfigChanged(prevState.timerConfig, timerConfig);

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
    }

    this.removeTimer = timeSync.addTimer(this.onTimerTick, timerConfig);
  }

  render() {
    const { children } = this.props;
    const { currentTime } = this.state;

    return children({
      currentTime
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
