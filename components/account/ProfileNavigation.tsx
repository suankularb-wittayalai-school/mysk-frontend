import ProfileTab from "@/components/account/ProfileTab";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { MaterialIcon } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * A set of tabs for navigating between Profile pages.
 */
const ProfileNavigation: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("account/common");

  const mysk = useMySKClient();

  return (
    <nav style={style} className={cn(`space-y-1`, className)}>
      <ProfileTab
        icon={<MaterialIcon icon="account_circle" />}
        href="/account/about"
      >
        {t("navigation.about")}
      </ProfileTab>
      <ProfileTab
        icon={<MaterialIcon icon="contacts" />}
        href="/account/contacts"
      >
        {t("navigation.contacts")}
      </ProfileTab>
      {mysk.user?.role === UserRole.student && (
        <ProfileTab
          icon={<MaterialIcon icon="developer_guide" />}
          href="/account/certificates"
        >
          {t("navigation.certificates")}
        </ProfileTab>
      )}
    </nav>
  );
};

export default ProfileNavigation;
