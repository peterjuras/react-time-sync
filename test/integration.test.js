import { HOURS, MINUTES } from '../src/index';

import PropTypes from 'prop-types';
import React from 'react';
import TimeProvider from '../src/time-provider';
import { connectTime } from '../src/connect-time';
import lolex from 'lolex';
import { mount } from 'enzyme';

describe('#integration', () => {
  let clock;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
  });

  it('should render a mix of wrapped components', () => {
    const TimeRenderer = ({ currentTime }) => <div>{currentTime}</div>;
    TimeRenderer.propTypes = { currentTime: PropTypes.number.isRequired };

    const SecondChild = connectTime()(TimeRenderer);
    const MinuteChild = connectTime({ interval: MINUTES })(TimeRenderer);
    const HourChild = connectTime({ interval: HOURS })(TimeRenderer);

    const ref = mount((
      <TimeProvider>
        <SecondChild />
        <MinuteChild />
        <HourChild />
      </TimeProvider>
    ));

    expect(ref).toMatchSnapshot();

    clock.tick(1000 * 60 * 60);
    clock.tick(1000 * 60 * 5);
    clock.tick(1000 * 20);

    ref.update();
    expect(ref).toMatchSnapshot();
    ref.unmount();
  });
});
