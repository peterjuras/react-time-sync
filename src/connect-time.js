import React, { Component } from "react";
import TimeContext from "./context";

const DEFAULT_COMPONENT_CONFIG = {
  timeProp: "currentTime"
};
const TIMESYNC_PROP = "$$_TIME_SYNC_HIDDEN_$$";

function validateComponentConfig(componentConfig) {
  if (
    typeof componentConfig.timeProp !== "undefined" &&
    (typeof componentConfig.timeProp !== "string" ||
      componentConfig.timeProp === "")
  ) {
    throw new Error("timeProp must be a non-empty string value");
  }
}

export function connectTime(timerConfig, componentConfig = {}) {
  validateComponentConfig(componentConfig);

  const usedTimerConfig = timerConfig || {};
  const usedComponentConfig = {
    ...DEFAULT_COMPONENT_CONFIG,
    ...componentConfig
  };

  return WrappedComponent => {
    class TimeComponent extends Component {
      constructor(props) {
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

      componentDidMount() {
        this.removeTimer = this.props[TIMESYNC_PROP].addTimer(
          this.onTick,
          usedTimerConfig
        );
      }

      componentWillUnmount() {
        if (this.removeTimer) {
          this.removeTimer();
        }
      }

      onTick = currentTime => {
        this.setState({
          [usedComponentConfig.timeProp]: currentTime
        });
      };

      render() {
        const { [TIMESYNC_PROP]: _, ...props } = this.props;
        return <WrappedComponent {...props} {...this.state} />;
      }
    }

    return props => (
      <TimeContext.Consumer>
        {timeSync => {
          const childProps = { ...props, [TIMESYNC_PROP]: timeSync };
          return <TimeComponent {...childProps} />;
        }}
      </TimeContext.Consumer>
    );
  };
}
