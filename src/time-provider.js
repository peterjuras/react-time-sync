import { Component } from "react";
import PropTypes from "prop-types";
import TimeSync from "time-sync";

export default class TimeProvider extends Component {
  static childContextTypes = {
    timeSync: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.node
  };

  static defaultProps = {
    children: null
  };

  constructor(props) {
    super(props);

    this.timeSync = new TimeSync();
  }

  getChildContext() {
    return {
      timeSync: {
        getCurrentTime: TimeSync.getCurrentTime,
        addTimer: this.timeSync.addTimer
      }
    };
  }

  componentWillUnmount() {
    this.timeSync.removeAllTimers();
  }

  render() {
    return this.props.children;
  }
}
