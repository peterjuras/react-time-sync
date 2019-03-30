import React, { FC, ReactElement } from "react";
import PropTypes from "prop-types";
import { useTime, TimerConfig } from "./use-time";

export type TimedChildrenType = (obj: {
  currentTime: number;
}) => ReactElement | ReactElement[];

interface TimerConfigProps extends TimerConfig {
  children?: TimedChildrenType;
}

const Timed: FC<TimerConfigProps> = (props): ReactElement | null => {
  const currentTime = useTime(props);

  if (!props.children) {
    return null;
  }

  return <>{props.children({ currentTime })}</>;
};

Timed.propTypes = {
  children: PropTypes.func
};

export default Timed;
