# react-time-sync

[![npm (scoped)](https://img.shields.io/npm/v/react-time-sync.svg)](https://www.npmjs.com/package/react-time-sync) [![CircleCI](https://circleci.com/gh/peterjuras/react-time-sync.svg?style=svg)](https://circleci.com/gh/peterjuras/react-time-sync) [![Coverage Status](https://coveralls.io/repos/github/peterjuras/react-time-sync/badge.svg?branch=master)](https://coveralls.io/github/peterjuras/react-time-sync?branch=master)

A React library to synchronize timers across an application

## Usage

When using any timed component or hook, a `<TimeProvider>` component needs to be in the top of your component hierarchy

Example:
```js
import { TimeProvider } from 'react-time-sync';

const App = ({ content }) => {
  return (
    <div>
      <TimeProvider>
        {content}
      </TimeProvider>
    </div>
  )
};
```

### useCountdown hook

A custom hook which returns the time left until a certain millisecond UTC timestamp is reached

Example:
```js
import { useCountdown } from 'react-time-sync';

const MyComponent = ({ until }) => {
  const timeLeft = useCountdown({ until });
  return <div>{timeLeft > 0 ? `${timeLeft} seconds left` : 'Done!'}</div>;
}
```

#### Input

The `useCountdown` hook expects an object with the following properties as the single argument:

`until` - A UTC millisecond timestamp until when the countdown should run (default: 0)
`interval` - one of `TimeSync.SECONDS`, `TimeSync.MINUTES`, `TimeSync.HOURS`, `TimeSync.DAYS` (default: `TimeSync.SECONDS`)

### useTime hook

A custom hook which returns the current time rounded to the specified interval

Example:
```js
import { useTime } from 'react-time-sync';

const MyComponent = () => {
  const currentTime = useTime();
  return <div>{`The current time is: ${currentTime}`}</div>;
}
```

#### Input

The `useTime` hook expects an object with the following properties as the single argument:

`unit` - The number of units of `interval` (default: `1`)
`interval` - one of `TimeSync.SECONDS`, `TimeSync.MINUTES`, `TimeSync.HOURS`, `TimeSync.DAYS` (default: `TimeSync.SECONDS`)

### <Countdown>

A component that accepts render props to periodically re-render its children with the time left until a certain millisecond UTC timestamp

Example:
```js
import { Countdown } from 'react-time-sync';

const MyComponent = ({ until }) => {
  return (
    <Countdown until={until}>
    {({ timeLeft }) => (
      <div>{timeLeft > 0 ? `${timeLeft} seconds left` : 'Done!'}</div>
    )}
    </Countdown>
  )
}

const until = Date.now() + 5000;

ReactDOM.render(<MyComponent until={until} />, ...);
```

#### Props

`until` - A UTC millisecond timestamp until when the countdown should run (required)
`interval` - one of `TimeSync.SECONDS`, `TimeSync.MINUTES`, `TimeSync.HOURS`, `TimeSync.DAYS` (default: `TimeSync.SECONDS`)

### <Timed>

A component that accepts render props to periodically re-render its children with the current time rounded to the specified interval

Example:
```js
import { Timed } from 'react-time-sync';

const MyComponent = () => {
  return (
    <Timed>
    {({ currentTime }) => (
      <div>{`The current time is: ${currentTime}`}</div>
    )}
    </Timed>
  )
}
```

#### Props

`unit` - The number of units of `interval` (default: `1`)
`interval` - one of `TimeSync.SECONDS`, `TimeSync.MINUTES`, `TimeSync.HOURS`, `TimeSync.DAYS` (default: `TimeSync.SECONDS`)

### connectTime()()

A higher order component meant to be used in combination with redux.

Example:
```js
import { connectTime, SECONDS } from 'react-time-sync';

const timeSlotsSelector = createSelector(
  currentTime => currentTime,
  currentTime => [currentTime - 1, currentTime + 1]
)

function mapStateToProps() {
  const timeSlots = timeSlotSelectors(currentTime)
  return {
    timeSlots
  };
}

const timerConfig = {
  unit: 1,
  interval: SECONDS
}

export default connectTime(timerConfig)(connect(mapStateToProps)(MyComponent));
```

#### timerConfig properties

`unit` - The number of units of `interval` (default: `1`)
`interval` - one of `TimeSync.SECONDS`, `TimeSync.MINUTES`, `TimeSync.HOURS`, `TimeSync.DAYS` (default: `TimeSync.SECONDS`)
