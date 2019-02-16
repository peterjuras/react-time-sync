const path = require("path");

const splitted = process.cwd().split(path.sep);

if (splitted[splitted.length - 1] !== "build") {
  console.log(
    "ERROR! You can only publish outside of the transpiled /build folder\n"
  );
  process.exit(1);
}
