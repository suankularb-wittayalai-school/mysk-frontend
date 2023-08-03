// Imports
import { Interactive } from "@suankularb-components/react";
import Image from "next/image";
import { dash } from "radash";
import { ComponentProps, FC, forwardRef } from "react";

/**
 * An app inside the App Drawer. A child of App Drawer Segment.
 * 
 * @param src The `next/image` source for the logo.
 * @param name The name of the app.
 * @param href The link to the app or the app’s install page.
 * 
 * @returns An `<li>`.
 */
const AppDrawerItem: FC<{
  src: ComponentProps<typeof Image>["src"];
  name: string;
  href: string;
}> = ({ src, name, href }) => (
  <li className="flex w-16 flex-col gap-1">
    <Interactive
      href={href}
      // eslint-disable-next-line react/display-name
      element={forwardRef((props, ref) => (
        <a id={`app-${dash(name)}`} ref={ref} {...props} target="_blank" />
      ))}
      className="light h-16 w-16 rounded-lg bg-surface-5"
    >
      <Image src={src} alt="" />
    </Interactive>
    <label htmlFor={`app-${dash(name)}`} className="skc-body-small text-center">
      {name}
    </label>
  </li>
);

export default AppDrawerItem;
