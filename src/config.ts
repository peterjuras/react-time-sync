export function hasConfigChanged(
  oldConfig: { [key: string]: any },
  newConfig: { [key: string]: any }
) {
  // if (!oldConfig) {
  //   return true;
  // }

  const oldKeys = Object.keys(oldConfig);
  if (oldKeys.length !== Object.keys(newConfig).length) {
    return true;
  }

  return oldKeys.some(key => newConfig[key] !== oldConfig[key]);
}
