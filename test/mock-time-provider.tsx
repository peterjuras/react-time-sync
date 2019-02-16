import React, { Component } from "react";
import TimeContext from "../src/context";
import PropTypes from "prop-types";

interface ProviderConfig {
  addTimer?: any;
  getCurrentTime?: any;
  getTimeLeft?: any;
  createCountdown?: any;
}

const DEFAULT_CONFIG: {
  addTimer: any;
  getCurrentTime: any;
  getTimeLeft: any;
  createCountdown: any;
} = {
  addTimer: () => null,
  getCurrentTime: () => null,
  getTimeLeft: () => 0,
  createCountdown: () => null
};

export function createMockProvider(config: ProviderConfig): any {
  const mockConfig = {
    ...DEFAULT_CONFIG,
    ...config
  };

  class MockTimeProvider extends Component {
    public static propTypes = {
      children: PropTypes.node
    };

    public static defaultProps = {
      children: null
    };

    public state = {
      timeSync: {
        ...mockConfig
      }
    };

    public render(): JSX.Element {
      const { timeSync } = this.state;
      const { children } = this.props;

      return (
        <TimeContext.Provider value={timeSync}>{children}</TimeContext.Provider>
      );
    }
  }

  return MockTimeProvider;
}
