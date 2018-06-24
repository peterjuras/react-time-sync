import React, { Component } from "react";
import TimeContext from "../src/context";
import PropTypes from "prop-types";

const DEFAULT_CONFIG = {
  addTimer: () => {},
  getCurrentTime: () => {}
};

export function createMockProvider(config) {
  const mockConfig = {
    ...DEFAULT_CONFIG,
    ...config
  };

  class MockTimeProvider extends Component {
    static propTypes = {
      children: PropTypes.node
    };

    static defaultProps = {
      children: null
    };

    state = {
      timeSync: {
        ...mockConfig
      }
    };

    render() {
      return (
        <TimeContext.Provider value={this.state.timeSync}>
          {this.props.children}
        </TimeContext.Provider>
      );
    }
  }

  return MockTimeProvider;
}
