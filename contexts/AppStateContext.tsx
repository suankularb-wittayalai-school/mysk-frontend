// External libraries
import { createContext } from "react";

// Types
import { ColorScheme } from "@/utils/types/common";

/**
 * A context to read and control the state of the app, like dark mode and
 * Navigation Drawer.
 */
const AppStateContext = createContext<{
  colorScheme?: ColorScheme;
  setColorScheme: (mode: ColorScheme) => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  accountNotFoundOpen: boolean;
  setAccountNotFoundOpen: (open: boolean) => void;
}>({
  colorScheme: "auto",
  setColorScheme: () => {},
  navOpen: false,
  setNavOpen: () => {},
  accountNotFoundOpen: false,
  setAccountNotFoundOpen: () => {},
});

export default AppStateContext;
