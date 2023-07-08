import React from "react";
import { ReactComponentLike } from "prop-types";
import { useTime, TimerConfig } from "./use-time";

interface ComponentConfig {
  timeProp: string;
}

const DEFAULT_COMPONENT_CONFIG: ComponentConfig = {
  timeProp: "currentTime",
};

function validateComponentConfig(
  componentConfig: Partial<ComponentConfig>,
): void {
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
  componentConfig: Partial<ComponentConfig> = {},
): (
  WrappedComponent: ReactComponentLike,
) => (props: Record<string, unknown>) => JSX.Element {
  validateComponentConfig(componentConfig);

  const usedTimerConfig = timerConfig || {};
  const usedComponentConfig = {
    ...DEFAULT_COMPONENT_CONFIG,
    ...componentConfig,
  };

  return (
    WrappedComponent: ReactComponentLike,
  ): ((props: Record<string, unknown>) => JSX.Element) => {
    return function TimeComponent(props: Record<string, unknown>): JSX.Element {
      const timeProps = {
        ...props,
        [usedComponentConfig.timeProp]: useTime(usedTimerConfig),
      };
      return <WrappedComponent {...timeProps} />;
    };
  };
}
