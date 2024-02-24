import IDCardDialog from "@/components/account/IDCardDialog";
import LogOutDialog from "@/components/account/LogOutDialog";
import AboutPersonSummary from "@/components/account/about/AboutPersonSummary";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import { Actions, Button, MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * The header of the About You page.
 *
 * @param person The Person to display the information of.
 * @param onSave Triggers when the user clicks the “Save changes” Button.
 * @param loading Whether the “Save changes” Button is in a loading state. Disables the Button.
 */
const AboutHeader: StylableFC<{
  person: Student | Teacher;
  onSave: () => void;
  loading?: boolean;
}> = ({ person, onSave, loading, style, className }) => {
  const { t } = useTranslation("account", { keyPrefix: "profile" });

  const [logOutOpen, setLogOutOpen] = useState(false);
  const [idCardOpen, setIDCardOpen] = useState(false);

  return (
    <header
      style={style}
      className={cn(`grid flex-row items-end gap-2 md:flex`, className)}
    >
      <AboutPersonSummary person={person} className="grow" />
      <Actions className="!grid grid-cols-4 md:!flex">
        {/* Log out */}
        <Button
          appearance="outlined"
          {...(person.role === UserRole.student
            ? {
                icon: <MaterialIcon icon="logout" />,
                tooltip: t("action.logOut"),
              }
            : undefined)}
          dangerous
          onClick={() => setLogOutOpen(true)}
        >
          {person.role !== UserRole.student && t("action.logOut")}
        </Button>
        <LogOutDialog open={logOutOpen} onClose={() => setLogOutOpen(false)} />

        {/* ID Card */}
        {person.role === UserRole.student && (
          <>
            <Button
              appearance="tonal"
              icon={<MaterialIcon icon="badge" />}
              tooltip={t("action.idCard")}
              onClick={() => setIDCardOpen(true)}
            />
            <IDCardDialog
              open={idCardOpen}
              person={person}
              onClose={() => setIDCardOpen(false)}
            />
          </>
        )}

        {/* Save changes */}
        <Button
          appearance="filled"
          disabled={loading}
          onClick={onSave}
          className="!col-span-2 md:!col-span-1"
        >
          {t("action.save")}
        </Button>
      </Actions>
    </header>
  );
};

export default AboutHeader;
