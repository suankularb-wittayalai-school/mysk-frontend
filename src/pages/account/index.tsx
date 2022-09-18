// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardSupportingText,
  Dropdown,
  Header,
  KeyboardInput,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ProfilePicture from "@components/ProfilePicture";

// Backend
import { getUserFromReq } from "@utils/backend/person/person";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useSubjectGroupOption } from "@utils/hooks/subject";

// Types
import { ClassWNumber } from "@utils/types/class";
import { LangCode } from "@utils/types/common";
import { Person, Student, Teacher } from "@utils/types/person";

const BasicInfoSection = ({
  user,
}: {
  user: Student | Teacher;
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
    prefix: user.prefix,
    thFirstName: user.name.th.firstName,
    thMiddleName: user.name.th.middleName,
    thLastName: user.name.th.lastName,
    enFirstName: user.name["en-US"]?.firstName || "",
    enMiddleName: user.name["en-US"]?.middleName || "",
    enLastName: user.name["en-US"]?.lastName || "",
  });

  // TODO: Fetch Classes here
  const subjectGroups = useSubjectGroupOption();
  const classes: ClassWNumber[] = [];

  function validate(): boolean {
    if (!["Master", "Mr.", "Mrs.", "Miss."].includes(form.prefix)) return false;
    if (!form.thFirstName) return false;
    if (!form.thLastName) return false;
    if (!form.enFirstName) return false;
    if (!form.enLastName) return false;

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
          <Dropdown
            name="prefix"
            label={t("profile.name.prefix.label")}
            options={
              user.role == "teacher"
                ? [
                    { value: "Mr.", label: t("profile.name.prefix.mister") },
                    { value: "Miss.", label: t("profile.name.prefix.miss") },
                    { value: "Mrs.", label: t("profile.name.prefix.missus") },
                  ]
                : [
                    { value: "Master", label: t("profile.name.prefix.master") },
                    { value: "Mr.", label: t("profile.name.prefix.mister") },
                  ]
            }
            defaultValue={user.prefix}
            onChange={(e: Person["prefix"]) => setForm({ ...form, prefix: e })}
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
            name="en-first-name"
            type="text"
            label={t("profile.enName.firstName")}
            defaultValue={user.name["en-US"]?.firstName || ""}
            onChange={(e: string) => setForm({ ...form, thFirstName: e })}
          />
          <KeyboardInput
            name="en-middle-name"
            type="text"
            label={t("profile.enName.middleName")}
            defaultValue={user.name["en-US"]?.middleName || ""}
            onChange={(e: string) => setForm({ ...form, thMiddleName: e })}
          />
          <KeyboardInput
            name="en-last-name"
            type="text"
            label={t("profile.enName.lastName")}
            defaultValue={user.name["en-US"]?.lastName || ""}
            onChange={(e: string) => setForm({ ...form, thLastName: e })}
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
        <Button
          label={t(
            `editInfo.action.${user.role == "teacher" ? "save" : "sendRequest"}`
          )}
          type="filled"
          disabled={!validate()}
        />
      </Actions>
    </Section>
  );
};

const AdminAvailable = (): JSX.Element => {
  const { t } = useTranslation("account");

  return (
    <Section>
      <div>
        <Card type="stacked" appearance="tonal">
          <CardHeader
            icon={<MaterialIcon icon="admin_panel_settings" />}
            title={<h3>{t("adminAvailable.title")}</h3>}
            label={t("adminAvailable.subtitle")}
          />
          <CardSupportingText>
            <p>{t("adminAvailable.crudInfo")}</p>
            <p>{t("adminAvailable.addiPriv")}</p>
          </CardSupportingText>
          <CardActions>
            <LinkButton
              label={t("adminAvailable.action.goToPanel")}
              type="filled"
              icon={<MaterialIcon icon="admin_panel_settings" />}
              url="/admin"
              LinkElement={Link}
              className="!flex !w-full justify-center sm:!w-fit"
            />
          </CardActions>
        </Card>
      </div>
    </Section>
  );
};

const AccountDetails: NextPage<{ user: Student | Teacher }> = ({ user }) => {
  const { t } = useTranslation("account");

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
        <BasicInfoSection user={user} />
        <EditInfoSection user={user} />
        {/* {user.isAdmin && <AdminAvailable />} */}
        <AdminAvailable />
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const { data: user, error } = await getUserFromReq(req);
  if (error)
    return { redirect: { destination: "/account/login", permanent: false } };

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
