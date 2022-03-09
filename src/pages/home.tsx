// Modules
import { NextPage } from "next";
import Link from "next/link";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";
import { useRouter } from "next/router";

const UserSection = () => {
  const { t } = useTranslation("dashboard");
  const router = useRouter();

  // Dummybase
  const user = {
    name: {
      "en-US": { firstName: "Sadudee", lastName: "Theparree" },
      th: { firstName: "สดุดี", lastName: "เทพอารีย์" },
    },
    class: "405",
    classNo: "11",
  };
  const notifCount = 1;

  return (
    <div className="section">
      <div className="grid grid-cols-[1fr_3fr] gap-2 sm:grid-cols-[1fr_5fr] sm:gap-6">
        <div className="container-tertiary aspect-square w-full rounded-xl sm:rounded-8xl" />
        <div className="items-between flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <h2 className="font-display text-4xl font-bold">
                {user.name[router.locale == "th" ? "th" : "en-US"].firstName}{" "}
                {user.name[router.locale == "th" ? "th" : "en-US"].lastName}
              </h2>
              <p className="font-display text-xl">
                <Trans i18nKey="user.classAndNo" ns="dashboard">
                  M.{{ class: user.class }} No.{{ classNo: user.classNo }}
                </Trans>
              </p>
            </div>

            {/* TODO: Replace the following element with `Chip` once it is added to `@suankularb-components/react */}
            <div className="container-error flex w-fit flex-row gap-1 rounded-xl p-2">
              <MaterialIcon
                icon={notifCount > 0 ? "notifications_active" : "notifications"}
                className="text-error"
              />
              <p>
                <Trans
                  i18nKey="user.hasNotifications"
                  ns="dashboard"
                  count={notifCount}
                >
                  You have {{ notifCount }} notifications.
                </Trans>
              </p>
              {notifCount > 0 && (
                <MaterialIcon icon="arrow_forward" className="text-error" />
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              name={t("user.action.changePassword")}
              type="text"
              onClick={() => {}}
            />
            <Button
              name={t("user.action.requestEdit")}
              type="outlined"
              onClick={() => {}}
            />
            <Button
              name={t("user.action.logOut")}
              type="filled"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Page
const Home: NextPage = () => {
  const { t } = useTranslation("dashboard");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("title") }}
          pageIcon="home"
          backGoesTo="/"
          LinkElement={Link}
          className="sm:!hidden"
        />
      }
    >
      <UserSection />
    </RegularLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "dashboard"])),
  },
});

export default Home;
