import ProfileTab from "@/components/account/ProfileTab";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A set of tabs for navigating between Profile pages.
 * 
 * @param role The role of the currently logged in user.
 */
const ProfileNavigation: StylableFC<{
  role: UserRole;
}> = ({ role, style, className }) => {
  const { t } = useTranslation("account", { keyPrefix: "navigation" });

  return (
    <nav style={style} className={cn(`space-y-1`, className)}>
      <ProfileTab
        icon={<MaterialIcon icon="account_circle" />}
        href="/account/about"
      >
        {t("about")}
      </ProfileTab>
      <ProfileTab
        icon={<MaterialIcon icon="contacts" />}
        href="/account/contacts"
      >
        {t("contacts")}
      </ProfileTab>
      {role === UserRole.student && (
        <ProfileTab
          icon={<MaterialIcon icon="developer_guide" />}
          href="/account/certificates"
        >
          {t("certificates")}
        </ProfileTab>
      )}
    </nav>
  );
};

export default ProfileNavigation;
