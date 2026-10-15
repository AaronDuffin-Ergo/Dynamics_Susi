import { createContext, useContext } from "react";

const ShellNavigationContext = createContext({});

export const ShellNavigationProvider = ShellNavigationContext.Provider;

export function useShellNavigation() {
  return useContext(ShellNavigationContext);
}
