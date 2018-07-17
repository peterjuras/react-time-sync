import React, { Component } from "react";
import PropTypes from "prop-types";
import TimeContext, { TIMESYNC_PROP } from "./context";
import { hasConfigChanged } from "./config";

function getCountdownConfig(props) {
  const newCountdownConfig = {};

  if (props.interval) {
    newCountdownConfig.interval = props.interval;
  }

  if (props.until) {
    newCountdownConfig.until = props.until;
  } else {
    newCountdownConfig.until = 0;
  }

  return newCountdownConfig;
}

class Countdown extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    until: PropTypes.number,
    interval: PropTypes.string
  };

  static defaultProps = {
    until: null,
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
    this.resetCountdown();
  }

  componentDidUpdate(prevProps, prevState) {
    const { countdownConfig } = this.state;

    if (prevState.countdownConfig !== countdownConfig) {
      this.resetCountdown();
    }
  }

  componentWillUnmount() {
    if (this.stopCountdown) {
      this.stopCountdown();
    }
  }

  onCountdownTick = timeLeft => {
    this.setState({ timeLeft });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const countdownConfig = getCountdownConfig(nextProps);
    const hasChanged = hasConfigChanged(
      prevState.countdownConfig,
      countdownConfig
    );

    if (hasChanged) {
      return {
        countdownConfig,
        timeLeft: nextProps[TIMESYNC_PROP].getTimeLeft(countdownConfig)
      };
    }

    return null;
  }

  resetCountdown() {
    const { countdownConfig, timeLeft } = this.state;

    if (this.stopCountdown) {
      this.stopCountdown();
      this.stopCountdown = null;
    }

    if (timeLeft === 0) {
      return;
    }

    const { [TIMESYNC_PROP]: timeSync } = this.props;

    this.stopCountdown = timeSync.createCountdown(
      this.onCountdownTick,
      countdownConfig
    );
  }

  render() {
    const { children } = this.props;
    const { timeLeft } = this.state;

    return children({
      timeLeft
    });
  }
}

export default function CountdownWrapper(props) {
  return (
    <TimeContext.Consumer>
      {timeSync => <Countdown {...{ ...props, [TIMESYNC_PROP]: timeSync }} />}
    </TimeContext.Consumer>
  );
}
