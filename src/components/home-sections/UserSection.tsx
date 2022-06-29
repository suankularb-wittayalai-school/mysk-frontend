// Modules
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Components
import ProfilePicture from "@components/ProfilePicture";

// Types
import { Student, Teacher } from "@utils/types/person";
import { nameJoiner } from "@utils/helpers/name";

const UserActions = ({
  setshowChangePassword,
  setShowEditProfile,
  setShowLogOut,
  className,
}: {
  setshowChangePassword: Function;
  setShowEditProfile: Function;
  setShowLogOut: Function;
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation("dashboard");

  // (@SiravitPhokeed) Edit Self is temporary disabled.

  return (
    <div
      className={`flex-row flex-wrap items-center justify-end gap-2 ${
        className || "flex"
      }`}
    >
      <Button
        label={t("user.action.changePassword")}
        type="text"
        onClick={() => setshowChangePassword(true)}
        // className="!hidden sm:!flex"
      />
      <Button
        label={t("user.action.requestEdit")}
        type="outlined"
        icon={<MaterialIcon icon="edit" />}
        disabled
        onClick={() => setShowEditProfile(true)}
        className="!hidden sm:!flex"
      />
      <Button
        label={t("user.action.logOut")}
        type="filled"
        icon={<MaterialIcon icon="logout" />}
        onClick={() => setShowLogOut(true)}
        className="!bg-error !text-on-error"
      />
    </div>
  );
};

const UserSection = ({
  user,
  setShowChangePassword,
  setShowEditProfile,
  setShowLogOut,
}: {
  user: Student | Teacher;
  setShowChangePassword: Function;
  setShowEditProfile: Function;
  setShowLogOut: Function;
}): JSX.Element => {
  const { t } = useTranslation("dashboard");
  const locale = useRouter().locale as "en-US" | "th";

  // Dummybase
  const notifCount = 0;

  return (
    <Section>
      <div className="grid grid-cols-[1fr_3fr] items-stretch gap-4 sm:gap-6 md:grid-cols-[1fr_5fr]">
        {/* Profile picture section */}
        <div>
          {/* Profile picture */}
          <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
            <ProfilePicture src={user.profile} />
          </div>
        </div>

        {/* Content section */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-grow flex-col gap-2">
            <div className="flex flex-col">
              {/* Name */}
              <h2 className="max-lines-1 break-all font-display text-4xl font-bold">
                {nameJoiner(locale, user.name)}
              </h2>

              {/* Class and number */}
              <p className="font-display text-xl">
                {user.role == "teacher" ? (
                  <Trans i18nKey="user.subjectAndClass" ns="dashboard">
                    Teacher in{" "}
                    {{
                      subjectGroup: user.subjectGroup.name[locale],
                    }}
                    <br />
                    Class advisor at M.{" "}
                    {{
                      classAdvisorAt: user.classAdvisorAt?.number,
                    }}
                  </Trans>
                ) : (
                  t("user.classAndNo", {
                    class: user.class.number,
                    classNo: user.classNo,
                  })
                )}
              </p>
            </div>

            {/* Notification chip */}
            <Link href="/notifications">
              <a className="hidden w-fit sm:block">
                <Card
                  type="horizontal"
                  appearance="tonal"
                  hasAction
                  className="container-error has-action--error !w-fit"
                >
                  <CardHeader
                    icon={
                      <MaterialIcon
                        icon={
                          notifCount > 0
                            ? "notifications_active"
                            : "notifications"
                        }
                        className="text-error"
                      />
                    }
                    title={
                      <Trans
                        i18nKey="user.hasNotifications"
                        ns="dashboard"
                        count={notifCount}
                      >
                        You have {{ notifCount }} notifications.
                      </Trans>
                    }
                    end={
                      <MaterialIcon
                        icon="arrow_forward"
                        className="text-error"
                      />
                    }
                    className="!gap-2 !p-2"
                  />
                </Card>
              </a>
            </Link>
          </div>
          <UserActions
            className="hidden md:flex"
            setshowChangePassword={setShowChangePassword}
            setShowEditProfile={setShowEditProfile}
            setShowLogOut={setShowLogOut}
          />
        </div>
      </div>
      <UserActions
        className="flex md:hidden"
        setshowChangePassword={setShowChangePassword}
        setShowEditProfile={setShowEditProfile}
        setShowLogOut={setShowLogOut}
      />
    </Section>
  );
};

export default UserSection;
