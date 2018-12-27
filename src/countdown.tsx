import React, { Component, FunctionComponent, ReactElement } from "react";
import PropTypes from "prop-types";
import TimeContext, { TIMESYNC_PROP, ITimeSyncContext } from "./context";
import { hasConfigChanged } from "./config";
import { Interval } from "time-sync/constants";

export interface ICountdownConfig {
  until?: number;
  interval?: Interval;
}

interface ISafeCountdownConfig extends ICountdownConfig {
  until: number;
}

interface ICountdownConfigProps extends ICountdownConfig {
  children?: (
    obj: { timeLeft: number }
  ) => ReactElement<any> | Array<ReactElement<any>>;
}

interface ICountdownProps extends ICountdownConfigProps {
  [TIMESYNC_PROP]: ITimeSyncContext;
}

function getCountdownConfig(props: ICountdownProps) {
  const newCountdownConfig: ISafeCountdownConfig = { until: 0 };

  if (props.interval) {
    newCountdownConfig.interval = props.interval;
  }

  if (props.until) {
    newCountdownConfig.until = props.until;
  }

  return newCountdownConfig;
}

interface ICountdownState {
  countdownConfig: ISafeCountdownConfig;
  timeLeft: number;
}

class Countdown extends Component<ICountdownProps, ICountdownState> {
  public static propTypes = {
    children: PropTypes.func.isRequired,
    until: PropTypes.number,
    interval: PropTypes.string
  };

  public static defaultProps = {
    until: null,
    interval: null
  };

  public static getDerivedStateFromProps(
    nextProps: ICountdownProps,
    prevState: ICountdownState
  ) {
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

  public state: ICountdownState = {
    countdownConfig: { until: 0 },
    timeLeft: 0
  };

  private stopCountdown?: (() => void) | null;

  constructor(props: ICountdownProps) {
    super(props);

    if (!props[TIMESYNC_PROP]) {
      throw new Error(
        "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
      );
    }
  }

  public componentDidMount() {
    this.resetCountdown();
  }

  public componentDidUpdate(_: ICountdownProps, prevState: ICountdownState) {
    const { countdownConfig } = this.state;

    if (prevState.countdownConfig !== countdownConfig) {
      this.resetCountdown();
    }
  }

  public componentWillUnmount() {
    if (this.stopCountdown) {
      this.stopCountdown();
    }
  }

  public render() {
    const { children } = this.props;
    const { timeLeft } = this.state;

    if (!children) {
      return null;
    }

    return children({
      timeLeft
    });
  }

  private onCountdownTick = (timeLeft: number) => {
    this.setState({ timeLeft });
  };

  private resetCountdown() {
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
}

const CountdownWrapper: FunctionComponent<ICountdownConfigProps> = props => {
  return (
    <TimeContext.Consumer>
      {timeSync => <Countdown {...{ ...props, [TIMESYNC_PROP]: timeSync }} />}
    </TimeContext.Consumer>
  );
};
export default CountdownWrapper;
