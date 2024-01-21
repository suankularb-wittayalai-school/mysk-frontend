import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Interactive, Text } from "@suankularb-components/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

/**
 * A tab in Profile Navigation.
 *
 * @param children The text of the tab.
 * @param icon The icon of the tab.
 * @param href The URL the tab goes to. Also used in determining if this tab is selected.
 */
const ProfileTab: StylableFC<{
  children: ReactNode;
  icon: JSX.Element;
  href: string;
}> = ({ children, icon, href, style, className }) => {
  const { pathname } = useRouter();
  const selected = pathname.startsWith(href);

  return (
    <Interactive
      href={href}
      element={Link}
      style={style}
      className={cn(
        `grid grid-cols-[1.5rem,1fr] gap-3 rounded-full px-3 py-2`,
        selected && `bg-primary-container text-on-primary-container`,
        className,
      )}
    >
      <div
        className={
          selected
            ? `[&>.skc-icon]:[font-variation-settings:'FILL'1]` // Fill icon
            : `text-on-surface-variant`
        }
      >
        {icon}
      </div>
      <Text type="title-medium" className="truncate">
        {children}
      </Text>
    </Interactive>
  );
};

export default ProfileTab;
