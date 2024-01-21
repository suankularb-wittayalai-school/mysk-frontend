import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Interactive, Text } from "@suankularb-components/react";
import Link from "next/link";
import { ReactNode } from "react";

const ProfileTab: StylableFC<{
  children: ReactNode;
  icon: JSX.Element;
  href: string;
  selected?: boolean;
}> = ({ children, icon, href, style, className }) => {
  return (
    <Interactive
      href={href}
      element={Link}
      style={style}
      className={cn(
        `grid grid-cols-[1.5rem,1fr] gap-3 rounded-full px-3 py-2`,
        className,
      )}
    >
      <div className="text-on-surface-variant">{icon}</div>
      <Text type="title-medium">{children}</Text>
    </Interactive>
  );
};

export default ProfileTab;
