import ProfileTab from "@/components/account/ProfileTab";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon } from "@suankularb-components/react";

/**
 * A set of tabs for navigating between Profile pages.
 */
const ProfileNavigation: StylableFC = ({ style, className }) => (
  <nav style={style} className={cn(`space-y-1`, className)}>
    <ProfileTab
      icon={<MaterialIcon icon="account_circle" />}
      href="/account/about"
    >
      About you
    </ProfileTab>
    <ProfileTab
      icon={<MaterialIcon icon="contacts" />}
      href="/account/contacts"
    >
      Your contacts
    </ProfileTab>
    <ProfileTab
      icon={<MaterialIcon icon="developer_guide" />}
      href="/account/certificates"
    >
      Certificates
    </ProfileTab>
  </nav>
);

export default ProfileNavigation;
