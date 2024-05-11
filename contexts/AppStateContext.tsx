import { ColorScheme } from "@/utils/types/common";
import { createContext } from "react";

/**
 * A context to read and control the state of the app, like dark mode and
 * Navigation Drawer.
 */
const AppStateContext = createContext<{
  colorScheme?: ColorScheme;
  setColorScheme: (mode: ColorScheme) => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}>({
  colorScheme: "auto",
  setColorScheme: () => {},
  navOpen: false,
  setNavOpen: () => {},
});

export default AppStateContext;
