import { useReducer } from "react";

export function useForceUpdate(): () => void {
  const [, forceUpdate] = useReducer((x): number => x + 1, 0);
  return (): void => forceUpdate();
}
