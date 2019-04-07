import { useReducer } from "react";

const EMPTY_ACTION = {};

export function useForceUpdate(): () => void {
  const [, forceUpdate] = useReducer((x): number => x + 1, 0);
  return (): void => forceUpdate(EMPTY_ACTION);
}
