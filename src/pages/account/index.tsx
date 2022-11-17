// External libraries
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";

import { useEffect, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Dropdown,
  Header,
  KeyboardInput,
  LayoutGridCols,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ChangePassword from "@components/dialogs/ChangePassword";
import LogOutDialog from "@components/dialogs/LogOut";
import ProfilePicture from "@components/ProfilePicture";

// Backend
import { getPersonFromUser } from "@utils/backend/person/person";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useSubjectGroupOption } from "@utils/hooks/subject";
import { useToggle } from "@utils/hooks/toggle";

// Types
import { ClassWNumber } from "@utils/types/class";
import { LangCode } from "@utils/types/common";
import { Student, Teacher } from "@utils/types/person";

const BasicInfoSection = ({
  user,
  toggleShowChangePwd,
  toggleShowLogOut,
}: {
  user: Student | Teacher;
  toggleShowChangePwd: () => void;
  toggleShowLogOut: () => void;
}): JSX.Element => {
  const { t } = useTranslation("account");
  const locale = useRouter().locale as LangCode;

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
                  <>
                    {t("basicInfo.subjectGroup", {
                      subjectGroup: getLocaleString(
                        user.subjectGroup.name,
                        locale
                      ),
                    })}
                    {user.classAdvisorAt && (
                      <>
                        <br />
                        {t("basicInfo.classAdvisorAt", {
                          classAdvisorAt: user.classAdvisorAt.number,
                        })}
                      </>
                    )}
                  </>
                ) : (
                  t("basicInfo.classAndNo", {
                    class: user.class.number,
                    classNo: user.classNo,
                  })
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Actions className="!grid grid-cols-2 !gap-x-2 !gap-y-4 md:!flex">
        <Button
          label={t("action.changePassword")}
          type="outlined"
          icon={<MaterialIcon icon="password" />}
          onClick={toggleShowChangePwd}
        />
        <Button
          label={t("action.logOut")}
          type="filled"
          icon={<MaterialIcon icon="logout" />}
          onClick={toggleShowLogOut}
          isDangerous
        />
        {user.isAdmin && (
          <LinkButton
            label={t("action.goToAdmin")}
            type="filled"
            icon={<MaterialIcon icon="admin_panel_settings" />}
            url="/admin"
            LinkElement={Link}
            className="col-span-2 md:col-span-1"
          />
        )}
      </Actions>
    </Section>
  );
};

const EditInfoSection = ({
  user,
}: {
  user: Student | Teacher;
}): JSX.Element => {
  const { t } = useTranslation("account");
  const locale = useRouter().locale as LangCode;

  // Form control
  const [form, setForm] = useState({
    thPrefix: user.prefix.th,
    thFirstName: user.name.th.firstName,
    thMiddleName: user.name.th.middleName,
    thLastName: user.name.th.lastName,
    enPrefix: user.prefix["en-US"] || "",
    enFirstName: user.name["en-US"]?.firstName || "",
    enMiddleName: user.name["en-US"]?.middleName || "",
    enLastName: user.name["en-US"]?.lastName || "",
  });

  // TODO: Fetch Classes here
  const subjectGroups = useSubjectGroupOption();
  const classes: ClassWNumber[] = [];

  function validate(): boolean {
    if (!form.thPrefix) return false;
    if (!form.thFirstName) return false;
    if (!form.thLastName) return false;

    return true;
  }

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="badge" allowCustomSize />}
        text={t("editInfo.title")}
      />

      {user.role == "student" && <p>{t("editInfo.requestInfo")}</p>}

      {/* Local name (Thai) */}
      <section>
        <h3 className="mb-1 font-display text-xl font-bold">
          {t("profile.name.title")}
        </h3>
        <div className="layout-grid-cols-4 !gap-y-0">
          <KeyboardInput
            name="th-prefix"
            type="text"
            label={t("profile.name.prefix")}
            helperMsg={t("profile.name.prefix_helper")}
            defaultValue={user.prefix.th}
            onChange={(e: string) => setForm({ ...form, thPrefix: e })}
          />
          <KeyboardInput
            name="th-first-name"
            type="text"
            label={t("profile.name.firstName")}
            defaultValue={user.name.th.firstName}
            onChange={(e: string) => setForm({ ...form, thFirstName: e })}
          />
          <KeyboardInput
            name="th-middle-name"
            type="text"
            label={t("profile.name.middleName")}
            defaultValue={user.name.th.middleName}
            onChange={(e: string) => setForm({ ...form, thMiddleName: e })}
          />
          <KeyboardInput
            name="th-last-name"
            type="text"
            label={t("profile.name.lastName")}
            defaultValue={user.name.th.lastName}
            onChange={(e: string) => setForm({ ...form, thLastName: e })}
          />
        </div>
      </section>

      {/* English name */}
      <section>
        <h3 className="mb-1 font-display text-xl font-bold">
          {t("profile.enName.title")}
        </h3>
        <div className="layout-grid-cols-4 !gap-y-0">
          <KeyboardInput
            name="en-prefix"
            type="text"
            label={t("profile.enName.prefix")}
            helperMsg={t("profile.enName.prefix_helper")}
            defaultValue={user.prefix["en-US"]}
            onChange={(e: string) => setForm({ ...form, enPrefix: e })}
          />
          <KeyboardInput
            name="en-first-name"
            type="text"
            label={t("profile.enName.firstName")}
            defaultValue={user.name["en-US"]?.firstName || ""}
            onChange={(e: string) => setForm({ ...form, enFirstName: e })}
          />
          <KeyboardInput
            name="en-middle-name"
            type="text"
            label={t("profile.enName.middleName")}
            defaultValue={user.name["en-US"]?.middleName || ""}
            onChange={(e: string) => setForm({ ...form, enMiddleName: e })}
          />
          <KeyboardInput
            name="en-last-name"
            type="text"
            label={t("profile.enName.lastName")}
            defaultValue={user.name["en-US"]?.lastName || ""}
            onChange={(e: string) => setForm({ ...form, enLastName: e })}
          />
        </div>
      </section>

      {/* Role */}
      {user.role == "teacher" && subjectGroups.length > 0 && (
        <section>
          <h3 className="mb-1 font-display text-xl font-bold">
            {t("profile.role.title")}
          </h3>
          <div className="layout-grid-cols-4 !gap-y-0">
            <Dropdown
              name="subject-group"
              label={t("profile.role.subjectGroup")}
              options={subjectGroups.map((subjectGroup) => ({
                value: subjectGroup.id,
                label: subjectGroup.name[locale],
              }))}
              defaultValue={user.subjectGroup.id}
            />
            <Dropdown
              name="class-counselor-at"
              label={t("profile.role.classAdvisorAt.label")}
              options={[
                {
                  value: 0,
                  label: t("profile.role.classAdvisorAt.none"),
                },
              ].concat(
                classes.map((classItem) => ({
                  value: classItem.id,
                  label: t("class", { ns: "common", number: classItem.number }),
                }))
              )}
            />
          </div>
        </section>
      )}

      <Actions>
        {/* TODO: Make this button work */}
        <Button
          label={t(
            `editInfo.action.${user.role == "teacher" ? "save" : "sendRequest"}`
          )}
          type="filled"
          // disabled={!validate()}
          disabled
        />
      </Actions>
    </Section>
  );
};

const PreferencesSection = (): JSX.Element => {
  const { t } = useTranslation("account");
  const router = useRouter();
  const locale = router.locale as LangCode;

  const [form, setForm] = useState({ locale });

  useEffect(() => {
    router.push(router.asPath, router.asPath, { locale: form.locale });
  }, [form.locale]);

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="settings" allowCustomSize />}
        text={t("preferences.title")}
      />
      <LayoutGridCols cols={3}>
        <Dropdown
          name="language"
          label="ภาษา / Display language"
          options={[
            { value: "th", label: "ภาษาไทย" },
            { value: "en-US", label: "English (United States)" },
          ]}
          defaultValue={locale}
          onChange={(e: LangCode) => setForm({ ...form, locale: e })}
        />
      </LayoutGridCols>
    </Section>
  );
};

const AccountDetails: NextPage<{ user: Student | Teacher }> = ({ user }) => {
  const { t } = useTranslation("account");

  // Dialog control
  const [showChangePwd, toggleShowChangePwd] = useToggle();
  const [showLogOut, toggleShowLogOut] = useToggle();

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("title"),
            }}
            pageIcon={<MaterialIcon icon="account_circle" />}
            backGoesTo={user.role == "teacher" ? "/teach" : "/learn"}
            LinkElement={Link}
          />
        }
      >
        <BasicInfoSection
          user={user}
          toggleShowChangePwd={toggleShowChangePwd}
          toggleShowLogOut={toggleShowLogOut}
        />
        {/* TODO: Edit Info functionality */}
        {/* <EditInfoSection user={user} /> */}
        <PreferencesSection />
      </RegularLayout>

      {/* Dialogs */}
      <ChangePassword show={showChangePwd} onClose={toggleShowChangePwd} />
      <LogOutDialog show={showLogOut} onClose={toggleShowLogOut} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: sbUser } = await supabase.auth.getUser();
  const { data: user } = await getPersonFromUser(supabase, sbUser.user as User);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
      user,
    },
  };
};

export default AccountDetails;
