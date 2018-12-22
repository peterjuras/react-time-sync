import React, { Component } from "react";
import TimeContext, { TIMESYNC_PROP, ITimeSyncContext } from "./context";
import { ReactComponentLike } from "prop-types";

interface IComponentConfig {
  timeProp?: string;
}

interface ISafeComponentConfig extends IComponentConfig {
  timeProp: string;
}

const DEFAULT_COMPONENT_CONFIG: ISafeComponentConfig = {
  timeProp: "currentTime"
};

function validateComponentConfig(componentConfig: IComponentConfig) {
  if (
    typeof componentConfig.timeProp !== "undefined" &&
    (typeof componentConfig.timeProp !== "string" ||
      componentConfig.timeProp === "")
  ) {
    throw new Error("timeProp must be a non-empty string value");
  }
}

interface ITimeComponentProps {
  [TIMESYNC_PROP]: ITimeSyncContext;
}

export function connectTime(timerConfig?: object | null, componentConfig = {}) {
  validateComponentConfig(componentConfig);

  const usedTimerConfig = timerConfig || {};
  const usedComponentConfig = {
    ...DEFAULT_COMPONENT_CONFIG,
    ...componentConfig
  };

  return (WrappedComponent: ReactComponentLike) => {
    class TimeComponent extends Component<ITimeComponentProps> {
      private removeTimer?: () => void;

      constructor(props: ITimeComponentProps) {
        super(props);

        if (!props[TIMESYNC_PROP]) {
          throw new Error(
            "Warning! TimeSync cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?"
          );
        }

        this.state = {
          [usedComponentConfig.timeProp]: props[TIMESYNC_PROP].getCurrentTime(
            usedTimerConfig
          )
        };
      }

      public render() {
        const { [TIMESYNC_PROP]: _, ...props } = this.props;
        return <WrappedComponent {...props} {...this.state} />;
      }

      public componentDidMount() {
        const { [TIMESYNC_PROP]: timeSync } = this.props;

        this.removeTimer = timeSync.addTimer(this.onTick, usedTimerConfig);
      }

      public componentWillUnmount() {
        if (this.removeTimer) {
          this.removeTimer();
        }
      }

      private onTick = (currentTime: number) => {
        this.setState({
          [usedComponentConfig.timeProp]: currentTime
        });
      };
    }

    return (props: object) => (
      <TimeContext.Consumer>
        {(timeSync: ITimeSyncContext) => (
          <TimeComponent {...{ ...props, [TIMESYNC_PROP]: timeSync }} />
        )}
      </TimeContext.Consumer>
    );
  };
}
