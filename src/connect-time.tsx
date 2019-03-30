import React from "react";
import { ReactComponentLike } from "prop-types";
import { useTime, TimerConfig } from "./use-time";

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

export function connectTime(
  timerConfig?: TimerConfig | null,
  componentConfig = {}
): (WrappedComponent: ReactComponentLike) => (props: object) => JSX.Element {
  validateComponentConfig(componentConfig);

  const usedTimerConfig = timerConfig || {};
  const usedComponentConfig = {
    ...DEFAULT_COMPONENT_CONFIG,
    ...componentConfig
  };

  return (WrappedComponent: ReactComponentLike) => {
    return function TimeComponent(props) {
      const timeProps = {
        ...props,
        [usedComponentConfig.timeProp]: useTime(usedTimerConfig)
      };
      return <WrappedComponent {...timeProps} />;
    };
  };
}
