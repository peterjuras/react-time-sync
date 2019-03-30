import React, { ReactElement, FC } from "react";
import PropTypes from "prop-types";
import { useCountdown, CountdownConfig } from "./use-countdown";

export type CountdownChildrenType = (obj: {
  timeLeft: number;
}) => ReactElement | ReactElement[];

interface CountdownConfigProps extends CountdownConfig {
  children?: CountdownChildrenType;
}

const Countdown: FC<CountdownConfigProps> = (props): ReactElement | null => {
  const timeLeft = useCountdown(props);

  if (!props.children) {
    return null;
  }

  return <>{props.children({ timeLeft })}</>;
};

Countdown.propTypes = {
  children: PropTypes.func
};

export default Countdown;
