import { Component } from "react";
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
    static childContextTypes = {
      timeSync: PropTypes.object
    };

    static propTypes = {
      children: PropTypes.node
    };

    static defaultProps = {
      children: null
    };

    getChildContext() {
      return {
        timeSync: {
          ...mockConfig
        }
      };
    }

    render() {
      return this.props.children;
    }
  }

  return MockTimeProvider;
}
