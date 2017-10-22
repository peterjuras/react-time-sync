const path = require('path');

const splitted = process.cwd().split(path.sep);

if (splitted[splitted.length - 1] !== 'lib') {
  // eslint-disable-next-line no-console
  console.log('ERROR! You can only publish outside of the transpiled /lib folder\n');
  process.exit(1);
}
