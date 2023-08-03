// Imports
import { dash } from "radash";
import { FC, ReactNode } from "react";

/**
 * A group of apps in the App Drawer.
 * 
 * @param title The title of the group.
 * @param children The apps in this segment.
 * 
 * @returns A `<section>`.
 */
const AppDrawerSegment: FC<{
  title: string;
  children: ReactNode;
}> = ({ title, children }) => (
  <section
    aria-labelledby={`drawer-${dash(title)}`}
    className="flex flex-col gap-2 p-4"
  >
    <h3 id={`drawer-${dash(title)}`} className="skc-title-medium">
      {title}
    </h3>
    <ul className="flex flex-row flex-wrap gap-3">{children}</ul>
  </section>
);

export default AppDrawerSegment;
