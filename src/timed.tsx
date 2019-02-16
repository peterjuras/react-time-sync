import React, { Component, FunctionComponent, ReactElement } from "react";
import PropTypes from "prop-types";
import TimeContext, { TIMESYNC_PROP, TimeSyncContext } from "./context";
import { hasConfigChanged } from "./config";
import { Interval } from "time-sync/constants";

export interface TimerConfig {
  interval?: Interval;
  unit?: number;
  [key: string]:
    | string
    | number
    | TimedChildrenType
    | undefined
    | TimeSyncContext;
}

export type TimedChildrenType = (obj: {
  currentTime: number;
}) => ReactElement | ReactElement[];

interface TimerConfigProps extends TimerConfig {
  children?: TimedChildrenType;
}

interface TimedProps extends TimerConfigProps {
  [TIMESYNC_PROP]: TimeSyncContext;
}

function getTimerConfig(props: TimedProps): TimerConfig {
  const newTimerConfig: TimerConfig = {};

  if (props.interval !== null) {
    newTimerConfig.interval = props.interval;
  }

  if (props.unit !== null) {
    newTimerConfig.unit = props.unit;
  }

  return newTimerConfig;
}

interface TimedState {
  timerConfig: TimerConfig;
  currentTime: number;
}

class Timed extends Component<TimedProps, TimedState> {
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
    nextProps: TimedProps,
    prevState: TimedState
  ): TimedState | null {
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

  public constructor(props: TimedProps) {
    super(props);

    if (!props[TIMESYNC_PROP]) {
      throw new Error(
        "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
      );
    }
  }

  public componentDidMount(): void {
    this.resetTimer();
  }

  public componentDidUpdate(_: TimedProps, prevState: TimedState): void {
    const { timerConfig } = this.state;

    if (prevState.timerConfig !== timerConfig) {
      this.resetTimer();
    }
  }

  public componentWillUnmount(): void {
    this.removeTimer();
  }

  public render(): ReturnType<TimedChildrenType> | null {
    const { children } = this.props;
    const { currentTime } = this.state;

    if (!children) {
      return null;
    }

    return children({
      currentTime
    });
  }

  private removeTimer: () => void = () => null;

  private onTimerTick = (currentTime: number) => {
    this.setState({ currentTime });
  };

  private resetTimer(): void {
    const { timerConfig } = this.state;

    const { [TIMESYNC_PROP]: timeSync } = this.props;

    this.removeTimer();

    this.removeTimer = timeSync.addTimer(this.onTimerTick, timerConfig);
  }
}

const TimedWrapper: FunctionComponent<TimerConfigProps> = (
  props
): ReactElement => {
  return (
    <TimeContext.Consumer>
      {timeSync => <Timed {...{ ...props, [TIMESYNC_PROP]: timeSync }} />}
    </TimeContext.Consumer>
  );
};
export default TimedWrapper;
