// Modules
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  CardSupportingText,
  CardActions,
  ChipFilterList,
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
  XScrollContent,
} from "@suankularb-components/react";

const UserActions = ({ className }: { className: string }): JSX.Element => {
  const { t } = useTranslation("dashboard");

  return (
    <div
      className={`flex-row flex-wrap items-center justify-end gap-2 ${
        className || "flex"
      }`}
    >
      <Button
        name={t("user.action.changePassword")}
        type="text"
        onClick={() => {}}
        className="!hidden sm:!flex"
      />
      <Button
        name={t("user.action.requestEdit")}
        type="outlined"
        icon={<MaterialIcon icon="edit" />}
        onClick={() => {}}
      />
      <Button
        name={t("user.action.logOut")}
        type="filled"
        icon={<MaterialIcon icon="logout" />}
        onClick={() => {}}
        className="!bg-error !text-on-error"
      />
    </div>
  );
};

const UserSection = (): JSX.Element => {
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
      <div className="grid grid-cols-[1fr_3fr] items-stretch gap-2 sm:gap-6 md:grid-cols-[1fr_5fr]">
        <div>
          <div className="container-tertiary relative aspect-square w-full overflow-hidden rounded-4xl sm:rounded-8xl">
            <Image src="/images/dummybase/sadudee.jpg" layout="fill" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-grow flex-col gap-2">
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
            <div className="container-error hidden w-fit flex-row items-center gap-1 rounded-xl p-2 sm:flex">
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
              <MaterialIcon icon="arrow_forward" className="text-error" />
            </div>
          </div>
          <UserActions className="hidden md:flex" />
        </div>
      </div>
      <UserActions className="flex md:hidden" />
    </div>
  );
};

const NewsSection = (): JSX.Element => {
  const { t } = useTranslation("dashboard");
  const [newsFilter, setNewsFilter] = useState<Array<string>>([]);

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="newspaper" allowCustomSize={true} />}
        text={t("news.title")}
      />
      <ChipFilterList
        choices={[
          { id: "news", name: t("news.filter.news") },
          { id: "forms", name: t("news.filter.forms") },
          { id: "payments", name: t("news.filter.payments") },
          [
            { id: "not-done", name: t("news.filter.amountDone.notDone") },
            { id: "done", name: t("news.filter.amountDone.done") },
          ],
        ]}
        onChange={(newFilter: Array<string>) => setNewsFilter(newFilter)}
      />
      <XScrollContent>
        <li>
          <Card type="stacked" appearance="outlined">
            <CardHeader
              icon={<MaterialIcon icon="edit" />}
              title={
                <h3 className="text-lg font-medium">ข้อมูลนักเรียนรายบุคคล</h3>
              }
              label={
                <div className="flex divide-x divide-outline">
                  <span className="pr-2">แบบสำรวจ</span>
                  <time className="pl-2 text-outline">20 มี.ค.</time>
                </div>
              }
              end={
                <div className="container-tertiary grid aspect-square w-10 place-content-center rounded-xl">
                  <MaterialIcon icon="close" />
                </div>
              }
              className="font-display"
            />
            <CardSupportingText>
              <p>ตรวจสอบและยืนยันข้อมูลนักเรียนรายบุคคล (DMC)</p>
            </CardSupportingText>
            <CardActions>
              <Button name="ทำแบบสำรวจ" type="filled" onClick={() => {}} className="container-secondary" />
            </CardActions>
          </Card>
        </li>
      </XScrollContent>
    </Section>
  );
};

// Page
const Home: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("brand.name") }}
          pageIcon={<MaterialIcon icon="home" />}
          backGoesTo="/"
          LinkElement={Link}
          className="sm:!hidden"
        />
      }
    >
      <UserSection />
      <NewsSection />
    </RegularLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "dashboard"])),
  },
});

export default Home;
