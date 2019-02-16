import React, { Component, FunctionComponent, ReactElement } from "react";
import PropTypes from "prop-types";
import TimeContext, { TIMESYNC_PROP, TimeSyncContext } from "./context";
import { hasConfigChanged } from "./config";
import { Interval } from "time-sync/constants";

export interface CountdownConfig {
  until?: number;
  interval?: Interval;
}

export interface SafeCountdownConfig extends CountdownConfig {
  until: number;
  [key: string]: number | string | undefined;
}

export type CountdownChildrenType = (obj: {
  timeLeft: number;
}) => ReactElement | ReactElement[];

interface CountdownConfigProps extends CountdownConfig {
  children?: CountdownChildrenType;
}

interface CountdownProps extends CountdownConfigProps {
  [TIMESYNC_PROP]: TimeSyncContext;
}

function getCountdownConfig(props: CountdownProps): SafeCountdownConfig {
  const newCountdownConfig: SafeCountdownConfig = { until: 0 };

  if (props.interval) {
    newCountdownConfig.interval = props.interval;
  }

  if (props.until) {
    newCountdownConfig.until = props.until;
  }

  return newCountdownConfig;
}

interface CountdownState {
  countdownConfig: SafeCountdownConfig;
  timeLeft: number;
}

class Countdown extends Component<CountdownProps, CountdownState> {
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
    nextProps: CountdownProps,
    prevState: CountdownState
  ): CountdownState | null {
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

  public state: CountdownState = {
    countdownConfig: { until: 0 },
    timeLeft: 0
  };

  private stopCountdown?: (() => void) | null;

  public constructor(props: CountdownProps) {
    super(props);

    if (!props[TIMESYNC_PROP]) {
      throw new Error(
        "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
      );
    }
  }

  public componentDidMount(): void {
    this.resetCountdown();
  }

  public componentDidUpdate(
    _: CountdownProps,
    prevState: CountdownState
  ): void {
    const { countdownConfig } = this.state;

    if (prevState.countdownConfig !== countdownConfig) {
      this.resetCountdown();
    }
  }

  public componentWillUnmount(): void {
    if (this.stopCountdown) {
      this.stopCountdown();
    }
  }

  public render(): ReturnType<CountdownChildrenType> | null {
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

  private resetCountdown(): void {
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

const CountdownWrapper: FunctionComponent<CountdownConfigProps> = (
  props
): JSX.Element => {
  return (
    <TimeContext.Consumer>
      {timeSync => <Countdown {...{ ...props, [TIMESYNC_PROP]: timeSync }} />}
    </TimeContext.Consumer>
  );
};
export default CountdownWrapper;
