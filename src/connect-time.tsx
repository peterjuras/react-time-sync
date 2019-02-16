import React, { Component } from "react";
import TimeContext, { TIMESYNC_PROP, TimeSyncContext } from "./context";
import { ReactComponentLike } from "prop-types";

interface ComponentConfig {
  timeProp?: string;
}

interface SafeComponentConfig extends ComponentConfig {
  timeProp: string;
}

const DEFAULT_COMPONENT_CONFIG: SafeComponentConfig = {
  timeProp: "currentTime"
};

function validateComponentConfig(componentConfig: ComponentConfig): void {
  if (
    typeof componentConfig.timeProp !== "undefined" &&
    (typeof componentConfig.timeProp !== "string" ||
      componentConfig.timeProp === "")
  ) {
    throw new Error("timeProp must be a non-empty string value");
  }
}

interface TimeComponentProps {
  [TIMESYNC_PROP]: TimeSyncContext;
}

export function connectTime(
  timerConfig?: object | null,
  componentConfig = {}
): (WrappedComponent: ReactComponentLike) => (props: object) => JSX.Element {
  validateComponentConfig(componentConfig);

  const usedTimerConfig = timerConfig || {};
  const usedComponentConfig = {
    ...DEFAULT_COMPONENT_CONFIG,
    ...componentConfig
  };

  return (WrappedComponent: ReactComponentLike) => {
    class TimeComponent extends Component<TimeComponentProps> {
      private removeTimer?: () => void;

      public constructor(props: TimeComponentProps) {
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

      public render(): JSX.Element {
        // TypeScript will output code that checks whether TIMESYNC_PROP is a symbol, but it never will be and will therefore be listed as uncovered.
        /* istanbul ignore next line */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [TIMESYNC_PROP]: _, ...props } = this.props;

        return <WrappedComponent {...props} {...this.state} />;
      }

      public componentDidMount(): void {
        const { [TIMESYNC_PROP]: timeSync } = this.props;

        this.removeTimer = timeSync.addTimer(this.onTick, usedTimerConfig);
      }

      public componentWillUnmount(): void {
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

    return function WrappedTimer(props: object) {
      return (
        <TimeContext.Consumer>
          {(timeSync: TimeSyncContext) => (
            <TimeComponent {...{ ...props, [TIMESYNC_PROP]: timeSync }} />
          )}
        </TimeContext.Consumer>
      );
    };
  };
}
