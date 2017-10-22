import lolex from 'lolex';

describe('#react-time-sync', () => {
  let clock;

  beforeEach(() => {
    clock = lolex.install({ now: 1 });
  });

  afterEach(() => {
    clock.uninstall();
  });

  it('empty', () => {});
});
