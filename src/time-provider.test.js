import { mount, render } from 'enzyme';

import PropTypes from 'prop-types';
import React from 'react';
import TimeProvider from './time-provider';

describe('#TimeProvider', () => {
  it('should be exported correctly', () => {
    expect(TimeProvider).toBeDefined();
  });

  it('should mount and unmount correctly', () => {
    const ref = mount(<TimeProvider />);
    ref.unmount();
  });

  it('should render null when no children are provided', () => {
    const ref = render(<TimeProvider />);
    expect(ref).toMatchSnapshot();
  });

  it('should render a single child', () => {
    const ref = render((
      <TimeProvider>
        <div>Test</div>
      </TimeProvider>
    ));
    expect(ref).toMatchSnapshot();
  });

  it('should render multiple children', () => {
    const ref = render((
      <TimeProvider>
        <div>Test1</div>
        <div>Test2</div>
        <div>Test3</div>
      </TimeProvider>
    ));
    expect(ref).toMatchSnapshot();
  });

  it('should provide timeSync context', () => {
    const Child = jest.fn(() => null);
    Child.contextTypes = { timeSync: PropTypes.object };
    const ref = mount((
      <TimeProvider>
        <Child />
      </TimeProvider>
    ));

    expect(Child.mock.calls[0][1].timeSync).toBeDefined();

    ref.unmount();
  });

  it('should provide the getCurrentTime function in the timeSync context', () => {
    const Child = jest.fn(() => null);
    Child.contextTypes = { timeSync: PropTypes.object };
    const ref = mount((
      <TimeProvider>
        <Child />
      </TimeProvider>
    ));

    expect(Child.mock.calls[0][1].timeSync.getCurrentTime).toBeInstanceOf(Function);

    ref.unmount();
  });

  it('should provide the addTimer function in the timeSync context', () => {
    const Child = jest.fn(() => null);
    Child.contextTypes = { timeSync: PropTypes.object };
    const ref = mount((
      <TimeProvider>
        <Child />
      </TimeProvider>
    ));

    expect(Child.mock.calls[0][1].timeSync.getCurrentTime).toBeInstanceOf(Function);

    ref.unmount();
  });

  it('should call removeAllTimers when unmounting', () => {
    const ref = mount(<TimeProvider />);
    const spy = jest.spyOn(ref.instance().timeSync, 'removeAllTimers');
    ref.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
