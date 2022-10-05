import { DispatchWithoutAction, useReducer } from "react";

export function useToggle(initial?: boolean): [boolean, DispatchWithoutAction] {
  const [value, setValue] = useReducer(
    (value: boolean) => !value,
    initial || false
  );
  return [value, setValue];
}
