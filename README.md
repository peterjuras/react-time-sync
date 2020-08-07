# react-time-sync

[![npm (scoped)](https://img.shields.io/npm/v/react-time-sync.svg)](https://www.npmjs.com/package/react-time-sync) [![Actions Status](https://github.com/peterjuras/react-time-sync/workflows/react-time-sync/badge.svg)](https://github.com/peterjuras/react-time-sync/actions) [![Coverage Status](https://coveralls.io/repos/github/peterjuras/react-time-sync/badge.svg?branch=main)](https://coveralls.io/github/peterjuras/react-time-sync?branch=main) [![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A React library to synchronize timers across an application. Requires React v16.8 or higher.

## Usage

### useCountdown hook

A custom hook which returns the time left until a certain millisecond UTC timestamp is reached

Example:

```js
import { useCountdown } from "react-time-sync";

const MyComponent = ({ until }) => {
  const timeLeft = useCountdown({ until });
  return <div>{timeLeft > 0 ? `${timeLeft} seconds left` : "Done!"}</div>;
};
```

#### Input

The `useCountdown` hook expects an object with the following properties as the single argument:

`until` - A UTC millisecond timestamp until when the countdown should run (default: 0)

`interval` - one of `TimeSync.SECONDS`, `TimeSync.MINUTES`, `TimeSync.HOURS`, `TimeSync.DAYS` (default: `TimeSync.SECONDS`)

### useTime hook

A custom hook which returns the current time rounded to the specified interval

Example:

```js
import { useTime } from "react-time-sync";

const MyComponent = () => {
  const currentTime = useTime();
  return <div>{`The current time is: ${currentTime}`}</div>;
};
```

#### Input

The `useTime` hook expects an object with the following properties as the single argument:

`unit` - The number of units of `interval` (default: `1`)

`interval` - one of `TimeSync.SECONDS`, `TimeSync.MINUTES`, `TimeSync.HOURS`, `TimeSync.DAYS` (default: `TimeSync.SECONDS`)

### Countdown

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

### Timed

A component that accepts render props to periodically re-render its children with the current time rounded to the specified interval

Example:

```js
import { Timed } from "react-time-sync";

const MyComponent = () => {
  return (
    <Timed>
      {({ currentTime }) => <div>{`The current time is: ${currentTime}`}</div>}
    </Timed>
  );
};
```

#### Props

`unit` - The number of units of `interval` (default: `1`)

`interval` - one of `TimeSync.SECONDS`, `TimeSync.MINUTES`, `TimeSync.HOURS`, `TimeSync.DAYS` (default: `TimeSync.SECONDS`)

### connectTime()()

A higher order component meant to be used in combination with redux.

Example:

```js
import { connectTime, SECONDS } from "react-time-sync";

const timeSlotsSelector = createSelector(
  (currentTime) => currentTime,
  (currentTime) => [currentTime - 1, currentTime + 1]
);

function mapStateToProps({ currentTime }) {
  const timeSlots = timeSlotSelectors(currentTime);
  return {
    timeSlots,
  };
}

const timerConfig = {
  unit: 1,
  interval: SECONDS,
};

export default connectTime(timerConfig)(connect(mapStateToProps)(MyComponent));
```

#### timerConfig properties

`unit` - The number of units of `interval` (default: `1`)

`interval` - one of `TimeSync.SECONDS`, `TimeSync.MINUTES`, `TimeSync.HOURS`, `TimeSync.DAYS` (default: `TimeSync.SECONDS`)

### TimeProvider

You can use a `<TimeProvider>` component to use a custom instance of `TimeSync`, e.g. when you want to synchronize timers across your application

Example:

```js
import { TimeProvider } from "react-time-sync";
import TimeSync from "time-sync";

const App = ({ content }) => {
  const timeSync = new TimeSync();
  return (
    <div>
      <TimeProvider timeSync={timeSync}>{content}</TimeProvider>
    </div>
  );
};
```

#### Props

`timeSync` - A custom `TimeSync` instance that should be passed down with the context. (default: `new TimeSync()`)
