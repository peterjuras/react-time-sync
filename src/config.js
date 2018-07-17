export function hasConfigChanged(oldConfig, newConfig) {
  if (!oldConfig) {
    return true;
  }

  const oldKeys = Object.keys(oldConfig);
  if (oldKeys.length !== Object.keys(newConfig).length) {
    return true;
  }

  return oldKeys.some(key => newConfig[key] !== oldConfig[key]);
}
