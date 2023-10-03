/**
 * `/account` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Sections**
 * - {@link BasicInfoSection}
 * - {@link UserFieldsSection}
 * - {@link UserContactsSection}
 *
 * **Page**
 * - {@link AccountPage}
 */

// Imports
import ContactsSection from "@/components/account/ContactSection";
import LogOutDialog from "@/components/account/LogOutDialog";
import PersonFields from "@/components/account/PersonFields";
import DynamicAvatar from "@/components/common/DynamicAvatar";
import PageHeader from "@/components/common/PageHeader";
import SnackbarContext from "@/contexts/SnackbarContext";
// import { createContact, updateContact } from "@/utils/backend/contact";
// import {
//   addContactToPerson,
//   editPerson,
//   getPersonFromUser,
//   removeContactFromPerson,
// } from "@/utils/backend/person/person";
// import { getSubjectGroups } from "@/utils/backend/subject/subjectGroup";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import addContactToPerson from "@/utils/backend/contact/addContactToPerson";
import createContact from "@/utils/backend/contact/createContact";
import updateContact from "@/utils/backend/contact/updateContact";
import { updatePerson } from "@/utils/backend/person/updatePerson";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import cn from "@/utils/helpers/cn";
import { withLoading } from "@/utils/helpers/loading";
import { getLocaleName, getLocaleString } from "@/utils/helpers/string";
import useForm from "@/utils/helpers/useForm";
import { useLocale } from "@/utils/hooks/i18n";
import { useRefreshProps } from "@/utils/hooks/routing";
import { useToggle } from "@/utils/hooks/toggle";
import { pantsSizeRegex } from "@/utils/patterns";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import {
  Actions,
  Button,
  ContentLayout,
  MaterialIcon,
  Section,
  Snackbar,
  Text,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC, useContext, useState } from "react";

/**
 * The most basic information about a Person, their name and their role inside
 * the school.
 *
 * @param person The Person to display information of.
 *
 * @returns A section.
 */
const BasicInfoSection: FC<{ person: Student | Teacher }> = ({ person }) => {
  const locale = useLocale();
  const { t } = useTranslation("account");

  // Dialog control
  const [logOutOpen, setLogOutOpen] = useState<boolean>(false);

  return (
    <section className="mx-4 flex flex-col gap-4 sm:mx-0">
      <div className="flex flex-col gap-3 md:flex-row md:gap-6">
        {/* Profile picture */}
        <DynamicAvatar
          profile={person.profile}
          className="!h-[4.5rem] !w-[4.5rem] basis-[4.5rem]"
        />

        {/* Text */}
        <div className="grow">
          {/* Name */}
          <Text type="display-small" element="h2">
            {getLocaleName(locale, person)}
          </Text>
          {/* Role within the school */}
          <Text type="headline-small" element="p">
            {
              // For a teacher: Class Advisor at and Subject Group
              person.role === "teacher"
                ? [
                    person.class_advisor_at &&
                      t("basicInfo.classAdvisorAt", {
                        classAdvisorAt: person.class_advisor_at.number,
                      }),
                    getLocaleString(person.subject_group.name, locale),
                  ]
                    .filter((segment) => segment)
                    .join(" • ")
                : person.classroom && // For a student: Class and Class No.
                  t("basicInfo.classAndNo", {
                    class: person.classroom.number,
                    classNo: person.class_no,
                  })
            }
          </Text>
        </div>
      </div>
      <Actions align="left">
        {/* Chat (future feature) */}
        {/* <Button
          appearance="tonal"
          icon={<MaterialIcon icon="chat" />}
          href="/account/chat"
          element={Link}
        >
          {t("action.chat")}
        </Button> */}

        {/* Log out */}
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="logout" />}
          dangerous
          onClick={() => setLogOutOpen(true)}
        >
          {t("action.logOut")}
        </Button>
        <LogOutDialog open={logOutOpen} onClose={() => setLogOutOpen(false)} />
      </Actions>
    </section>
  );
};

/**
 * An editable display of a Person’s information.
 *
 * @param person The Person to display information of.
 *
 * @returns A Section.
 */
const UserFieldsSection: FC<{
  person: Student | Teacher;
  subjectGroups: SubjectGroup[];
}> = ({ person, subjectGroups }) => {
  const { t } = useTranslation(["account", "common"]);

  const { setSnackbar } = useContext(SnackbarContext);

  // Form control
  const { form, setForm, resetForm, formOK, formProps } = useForm<
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
    { key: "middleNameEN", defaultValue: person.middle_name?.["en-US"] },
    {
      key: "lastNameEN",
      required: true,
      defaultValue: person.last_name["en-US"],
    },
    { key: "nicknameEN", defaultValue: person.nickname?.["en-US"] },
    {
      key: "subjectGroup",
      defaultValue:
        person.role === "teacher" && subjectGroups.length > 0
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

  const supabase = useSupabaseClient();

  const refreshProps = useRefreshProps();
  const [loading, toggleLoading] = useToggle();

  /**
   * Save the changes to Supabase.
   */
  async function handleSubmit() {
    withLoading(
      async () => {
        if (!formOK) {
          setSnackbar(
            <Snackbar>{t("snackbar.formInvalid", { ns: "common" })}</Snackbar>,
          );
          return false;
        }

        const { error } = await updatePerson(supabase, form, person);

        if (error) {
          setSnackbar(
            <Snackbar>{t("snackbar.failure", { ns: "common" })}</Snackbar>,
          );
          return false;
        }

        await refreshProps();
        setSnackbar(
          <Snackbar>{t("snackbar.changesSaved", { ns: "common" })}</Snackbar>,
        );
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <Section>
      <PersonFields
        subjectGroups={person.role === "teacher" ? subjectGroups : undefined}
        form={form}
        setForm={setForm}
        formProps={formProps}
      />
      <Actions
        className={cn(`sticky inset-0 bottom-20 z-20 !mx-0 -my-4 bg-surface px-4
          py-4 sm:static sm:my-0 sm:bg-transparent sm:p-0`)}
      >
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="undo" />}
          onClick={resetForm}
          disabled={loading}
        >
          {t("profile.action.reset")}
        </Button>
        <Button
          appearance="filled"
          icon={<MaterialIcon icon="save" />}
          onClick={handleSubmit}
          loading={loading || undefined}
        >
          {t("profile.action.save")}
        </Button>
      </Actions>
    </Section>
  );
};

/**
 * An editable display of a Person’s Contacts.
 *
 * @param person The Person to display Contacts of.
 *
 * @returns A Section.
 */
const UserContactsSection: FC<{ person: Student | Teacher }> = ({ person }) => {
  const { t } = useTranslation("common");
  const { setSnackbar } = useContext(SnackbarContext);
  const refreshProps = useRefreshProps();
  const supabase = useSupabaseClient();

  /**
   * Creates and add a Contact to this class.
   *
   * @param contact The Contact to add.
   */
  async function handleAdd(contact: Contact) {
    const { data: contactID, error } = await createContact(supabase, contact);
    if (error) {
      setSnackbar(<Snackbar>{t("snackbar.failure")}</Snackbar>);
      return;
    }

    const { error: personContactError } = await addContactToPerson(
      supabase,
      person,
      contactID,
    );

    if (personContactError) {
      console.error(personContactError);
      setSnackbar(<Snackbar>{t("snackbar.failure")}</Snackbar>);
      return;
    }

    refreshProps();
  }

  /**
   * Edits a given Contact.
   *
   * @param contact The new data for the Contact.
   */
  async function handleEdit(contact: Contact) {
    const { error } = await updateContact(supabase, contact);
    if (error) {
      setSnackbar(<Snackbar>{t("snackbar.failure")}</Snackbar>);
      return;
    }

    refreshProps();
  }

  /**
   * Delete a given Contact from Supabase.
   *
   * @param contactID The ID of the Contact to delete.
   */
  async function handleRemove(contactID: string) {
    const { error } = await supabase
      .from("contacts")
      .delete()
      .match({ id: contactID });

    if (error) {
      setSnackbar(<Snackbar>{t("snackbar.failure")}</Snackbar>);
      return;
    }

    refreshProps();
  }

  return (
    <ContactsSection
      contacts={person.contacts}
      {...{ handleAdd, handleEdit, handleRemove }}
    />
  );
};

/**
 * A page where a user can view and edit their information.
 *
 * @param person The Person to display information of.
 * @param subjectGroups A list of all Subject Groups; used in the edit form.
 *
 * @returns A Page.
 */
const AccountPage: CustomPage<{
  user: Student | Teacher;
  subjectGroups: SubjectGroup[];
}> = ({ user, subjectGroups }) => {
  // Translation
  const { t } = useTranslation("account");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout>
        <BasicInfoSection {...{ person: user }} />
        <UserFieldsSection {...{ person: user, subjectGroups }} />
        <UserContactsSection {...{ person: user }} />
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

  if (error) {
    return {
      notFound: true,
    };
  }

  const { data: subjectGroups } = await getSubjectGroups(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
        "account",
      ])),
      user,
      subjectGroups,
    },
  };
};

export default AccountPage;
