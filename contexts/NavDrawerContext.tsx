// External libraries
import { createContext } from "react";

/**
 * A Context that exposes if the Navigation Drawer is open and allows toggling
 * the Navigation Drawer.
 */
const NavDrawerContext = createContext<{
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}>({ navOpen: false, setNavOpen: () => {} });

export default NavDrawerContext;
