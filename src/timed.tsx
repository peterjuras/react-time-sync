import React, { Component, FunctionComponent } from "react";
import PropTypes, { ReactElementLike } from "prop-types";
import TimeContext, { TIMESYNC_PROP, ITimeSyncContext } from "./context";
import { hasConfigChanged } from "./config";
import { Interval } from "time-sync/constants";

export interface ITimerConfig {
  interval?: Interval;
  unit?: number;
}

interface ITimerConfigProps extends ITimerConfig {
  children?: (obj: { currentTime: number }) => ReactElementLike;
}

interface ITimedProps extends ITimerConfigProps {
  [TIMESYNC_PROP]: ITimeSyncContext;
}

function getTimerConfig(props: ITimedProps) {
  const newTimerConfig: ITimerConfig = {};

  if (props.interval !== null) {
    newTimerConfig.interval = props.interval;
  }

  if (props.unit !== null) {
    newTimerConfig.unit = props.unit;
  }

  return newTimerConfig;
}

interface ITimedState {
  timerConfig: ITimerConfig;
  currentTime: number;
}

class Timed extends Component<ITimedProps, ITimedState> {
  public static propTypes = {
    children: PropTypes.func.isRequired,
    unit: PropTypes.number,
    interval: PropTypes.string
  };

  public static defaultProps = {
    unit: null,
    interval: null
  };

  public static getDerivedStateFromProps(
    nextProps: ITimedProps,
    prevState: ITimedState
  ) {
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

  public state = {
    timerConfig: {},
    currentTime: 0
  };

  constructor(props: ITimedProps) {
    super(props);

    if (!props[TIMESYNC_PROP]) {
      throw new Error(
        "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
      );
    }
  }

  public componentDidMount() {
    this.resetTimer();
  }

  public componentDidUpdate(_: ITimedProps, prevState: ITimedState) {
    const { timerConfig } = this.state;

    if (prevState.timerConfig !== timerConfig) {
      this.resetTimer();
    }
  }

  public componentWillUnmount() {
    this.removeTimer();
  }

  public render() {
    const { children } = this.props;
    const { currentTime } = this.state;

    if (!children) {
      return null;
    }

    return children({
      currentTime
    });
  }

  private removeTimer: () => any = () => null;

  private onTimerTick = (currentTime: number) => {
    this.setState({ currentTime });
  };

  private resetTimer() {
    const { timerConfig } = this.state;

    const { [TIMESYNC_PROP]: timeSync } = this.props;

    this.removeTimer();

    this.removeTimer = timeSync.addTimer(this.onTimerTick, timerConfig);
  }
}

const TimedWrapper: FunctionComponent<ITimerConfigProps> = props => {
  return (
    <TimeContext.Consumer>
      {timeSync => <Timed {...{ ...props, [TIMESYNC_PROP]: timeSync }} />}
    </TimeContext.Consumer>
  );
};
export default TimedWrapper;
