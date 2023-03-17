// External libraries
import { createContext } from "react";

/**
 * A Context that provides the value and the setter for showing Snackbars.
 */
const SnackbarContext = createContext<{
  snackbar: JSX.Element | null;
  setSnackbar: (snackbar: JSX.Element | null) => void;
}>({ snackbar: null, setSnackbar: () => {} });

export default SnackbarContext;
