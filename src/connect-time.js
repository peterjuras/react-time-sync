import React, { Component } from 'react';

import PropTypes from 'prop-types';

const DEFAULT_COMPONENT_CONFIG = {
  timeProp: 'currentTime'
};

function validateComponentConfig(componentConfig) {
  if (
    typeof componentConfig.timeProp !== 'undefined' &&
    (
      typeof componentConfig.timeProp !== 'string' ||
      componentConfig.timeProp === ''
    )
  ) {
    throw new Error('timeProp must be a non-empty string value');
  }
}

export function connectTime(timerConfig, componentConfig = {}) {
  validateComponentConfig(componentConfig);

  const usedTimerConfig = timerConfig || {};
  const usedComponentConfig = {
    ...DEFAULT_COMPONENT_CONFIG,
    ...componentConfig
  };

  return (WrappedComponent) => {
    class TimeComponent extends Component {
      static contextTypes = {
        timeSync: PropTypes.object
      };

      constructor(props, context) {
        super(props);

        if (!context.timeSync) {
          throw new Error('Warning! TimeSync context cannot be found. Did you add <TimeProvider /> at the top of your component hierarchy?');
        }

        this.state = {
          [usedComponentConfig.timeProp]: context.timeSync.getCurrentTime(usedTimerConfig)
        };
      }

      componentDidMount() {
        this.removeTimer = this.context.timeSync.addTimer(this.onTick, usedTimerConfig);
      }

      componentWillUnmount() {
        if (this.removeTimer) {
          this.removeTimer();
        }
      }

      onTick = (currentTime) => {
        this.setState({
          [usedComponentConfig.timeProp]: currentTime
        });
      };

      render() {
        return <WrappedComponent {...this.props} {...this.state} />;
      }
    }

    return TimeComponent;
  };
}
