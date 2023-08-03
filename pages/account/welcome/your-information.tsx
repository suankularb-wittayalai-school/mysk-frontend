// External libraries
import { createPagesServerClient, User } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useContext, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
  Snackbar,
} from "@suankularb-components/react";

// Internal components
import ContactsSection from "@/components/account/ContactSection";
import PersonFields from "@/components/account/PersonFields";
import PageHeader from "@/components/common/PageHeader";
import NextWarningCard from "@/components/welcome/NextWarningCard";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
// import { getPersonFromUser, editPerson } from "@/utils/backend/person/person";
// import { getSubjectGroups } from "@/utils/backend/subject/subjectGroup";

// Helpers
import { changeItem } from "@/utils/helpers/array";
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";

// Miscellaneous
import { pantsSizeRegex } from "@/utils/patterns";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import { updatePerson } from "@/utils/backend/person/updatePerson";

const WelcomePage: CustomPage<{
  person: Student | Teacher;
  subjectGroups: SubjectGroup[];
}> = ({ person, subjectGroups }) => {
  // Translation
  // const locale = useLocale();
  const { t } = useTranslation(["welcome", "common"]);

  // Routing
  const router = useRouter();

  // Supabase
  const supabase = useSupabaseClient();

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  // Form control
  const { form, setForm, formProps } = useForm<
    | "prefixTH"
    | "firstNameTH"
    | "middleNameTH"
    | "lastNameTH"
    | "nicknameTH"
    | "prefixEN"
    | "firstNameEN"
    | "middleNameEN"
    | "lastNameEN"
    | "nicknameEN"
    | "subjectGroup"
    | "classAdvisorAt"
    | "gender"
    | "birthdate"
    | "citizenID"
    | "passportNumber"
    | "allergies"
    | "shirtSize"
    | "pantsSize"
    | "bloodGroup"
  >([
    {
      key: "prefixTH",
      required: true,
      defaultValue: person.prefix.th,
      validate: (value: string) =>
        person.role === "student" ? ["เด็กชาย", "นาย"].includes(value) : true,
    },
    {
      key: "firstNameTH",
      required: true,
      defaultValue: person.first_name.th,
    },
    { key: "middleNameTH", defaultValue: person.middle_name?.th },
    {
      key: "lastNameTH",
      required: true,
      defaultValue: person.last_name.th,
    },
    { key: "nicknameTH", defaultValue: person.nickname?.th },
    {
      key: "prefixEN",
      required: true,
      defaultValue: person.prefix["en-US"],
      validate: (value: string) =>
        person.role === "student" ? ["Master", "Mr."].includes(value) : true,
    },
    {
      key: "firstNameEN",
      required: true,
      defaultValue: person.first_name["en-US"],
    },
    {
      key: "middleNameEN",
      defaultValue: person.middle_name
        ? person.middle_name["en-US"]
        : undefined,
    },
    {
      key: "lastNameEN",
      required: true,
      defaultValue: person.last_name["en-US"],
    },
    {
      key: "nicknameEN",
      defaultValue: person.nickname ? person.nickname["en-US"] : undefined,
    },
    {
      key: "subjectGroup",
      defaultValue:
        person.role === "teacher" && subjectGroups.length
          ? person.subject_group.id || subjectGroups[0].id
          : undefined,
    },
    {
      key: "classAdvisorAt",
      defaultValue:
        person.role === "teacher" && person.class_advisor_at
          ? String(person.class_advisor_at.number)
          : undefined,
    },
    // { key: "gender", required: true },
    { key: "birthdate", required: true, defaultValue: person.birthdate },
    // {
    //   key: "citizenID",
    //   required: locale === "th",
    //   defaultValue: person.citizenID,
    //   validate: (value) =>
    //     validateCitizenID(value) ||
    //     t("profile.general.citizenID_error", { ns: "account" }),
    // },
    // {
    //   key: "passportNumber",
    //   validate: (value) =>
    //     Boolean(validatePassport(value)) ||
    //     t("profile.general.passportNumber_error", { ns: "account" }),
    // },
    { key: "allergies", defaultValue: person.allergies },
    { key: "shirtSize", defaultValue: person.shirt_size },
    {
      key: "pantsSize",
      defaultValue: person.pants_size,
      validate: (value: string) => pantsSizeRegex.test(value),
    },
    // { key: "bloodGroup", required: true },
  ]);
  const [contacts, setContacts] = useState<Contact[]>(person.contacts);

  // Form submission
  const [loading, toggleLoading] = useToggle();
  async function handleSubmit() {
    withLoading(async () => {
      const { error } = await updatePerson(
        supabase,
        { ...form, contacts },
        person,
      );

      if (error) {
        setSnackbar(
          <Snackbar>{t("snackbar.failure", { ns: "common" })}</Snackbar>,
        );
        return false;
      }

      if (person.role === "teacher")
        router.push("/account/welcome/your-subjects");
      else router.push("/account/welcome/logging-in");
      return true;
    }, toggleLoading);
  }

  return (
    <>
      <Head>
        <title>{createTitleStr(t("yourInformation.title"), t)}</title>
      </Head>
      <PageHeader
        title={t("yourInformation.title")}
        parentURL="/account/welcome"
      />
      <ContentLayout>
        <NextWarningCard />
        <Section className="pb-6">
          <Header>{t("yourInformation.general.title")}</Header>
          <p className="-mt-2">{t("yourInformation.general.desc")}</p>
          <p className="-mt-2">
            <Trans
              i18nKey="yourInformation.general.inControl"
              ns="welcome"
              components={[
                <Link
                  key={0}
                  href="/help/essentials/onboarding"
                  className="link"
                />,
              ]}
            />
          </p>
          <PersonFields
            subjectGroups={
              person.role === "teacher" ? subjectGroups : undefined
            }
            form={form}
            setForm={setForm}
            formProps={formProps}
          />
        </Section>
        <ContactsSection
          contacts={contacts}
          handleAdd={(contact) => setContacts([...contacts, contact])}
          handleEdit={(contact, idx) =>
            setContacts(changeItem<Contact>(contact, idx, contacts))
          }
          handleRemove={(contactID) =>
            setContacts(contacts.filter((item) => contactID !== item.id))
          }
        />
        <Actions className="mx-4 sm:mx-0 sm:mb-20">
          <Button
            appearance="filled"
            loading={loading || undefined}
            onClick={handleSubmit}
          >
            {t("common.action.next")}
          </Button>
        </Actions>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user, error } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  );

  const { data: subjectGroups } = await getSubjectGroups(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
        "account",
      ])),
      person: user,
      subjectGroups,
    },
  };
};

WelcomePage.childURLs = [
  "/account/welcome/your-subjects",
  "/account/welcome/logging-in",
];

WelcomePage.navType = "hidden";

export default WelcomePage;
