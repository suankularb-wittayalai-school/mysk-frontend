import { useEffect, useState } from "react";

export enum Breakpoint {
  base = 0,
  sm = 600,
  md = 905,
  lg = 1440,
}

/**
 * A hook that let allows access the current breakpoint.
 *
 * @returns
 * | Property          | Description                                                   |
 * | ----------------- | ------------------------------------------------------------- |
 * | `breakpoint`      | The current breakpoint.                                       |
 * | `breakpoints`     | An array of all breakpoints.                                  |
 * | `belowBreakpoint` | Whether the current breakpoint is below the given breakpoint. |
 * | `atBreakpoint`    | Whether the current breakpoint is at the given breakpoint.    |
 * | `aboveBreakpoint` | Whether the current breakpoint is above the given breakpoint. |
 */
export default function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  /** Gets the current width of the window and set the breakpoint. */
  function updateBreakpoint() {
    const width = window.innerWidth;
    let newBreakpoint: Breakpoint | null = null;
    for (const value of Object.values(Breakpoint))
      if (width >= Number(value)) newBreakpoint = <Breakpoint>value;
    setBreakpoint(newBreakpoint);
  }

  // Update the breakpoint on mount and on resize.
  useEffect(() => {
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    /** The current breakpoint. */
    breakpoint,
    /** An array of all breakpoints. */
    breakpoints: Object.values(Breakpoint),

    /**
     * Whether the current breakpoint is below the given breakpoint.
     * @param bp The breakpoint to compare.
     */
    belowBreakpoint: (bp: Breakpoint) => breakpoint && breakpoint < bp,
    /**
     * Whether the current breakpoint is at the given breakpoint.
     * @param bp The breakpoint to compare.
     */
    atBreakpoint: (bp: Breakpoint) => breakpoint === bp,
    /**
     * Whether the current breakpoint is above the given breakpoint.
     * @param bp The breakpoint to compare.
     */
    aboveBreakpoint: (bp: Breakpoint) => breakpoint && breakpoint > bp,
  };
}
