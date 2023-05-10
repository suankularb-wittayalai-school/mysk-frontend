// External libraries
import { createContext } from "react";

/**
 * A Context that provides the value of `router.pathname` before the last time
 * it was changed.
 */
const PreviousRouteContext = createContext<string | null>(null);

export default PreviousRouteContext;
