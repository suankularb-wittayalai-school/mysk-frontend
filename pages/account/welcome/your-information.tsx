// External libraries
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useContext, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  MenuItem,
  Section,
  Select,
  Snackbar,
  TextField,
} from "@suankularb-components/react";

// Internal components
import ContactCard from "@/components/account/ContactCard";
import ContactDialog from "@/components/account/ContactDialog";
import NextWarningCard from "@/components/welcome/NextWarningCard";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import { getPersonFromUser, setupPerson } from "@/utils/backend/person/person";
import { getSubjectGroups } from "@/utils/backend/subject/subjectGroup";

// Helpers
import { changeItem } from "@/utils/helpers/array";
import { getLocaleString } from "@/utils/helpers/i18n";
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, FormControlProps, LangCode } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";

const ThaiNameSection: FC<{ formProps: FormControlProps }> = ({
  formProps,
}) => {
  // Translation
  const { t } = useTranslation("account");

  return (
    <Section>
      <Header level={3}>{t("profile.name.title")}</Header>
      <Columns columns={4} className="my-3 !gap-y-12">
        <TextField
          appearance="outlined"
          label={t("profile.name.prefix")}
          helperMsg={t("profile.name.prefix_helper")}
          {...formProps.prefixTH}
        />
        <TextField
          appearance="outlined"
          label={t("profile.name.firstName")}
          {...formProps.firstNameTH}
        />
        <TextField
          appearance="outlined"
          label={t("profile.name.middleName")}
          helperMsg={t("profile.name.middleName_helper")}
          {...formProps.middleNameTH}
        />
        <TextField
          appearance="outlined"
          label={t("profile.name.lastName")}
          {...formProps.lastNameTH}
        />
        {/* <TextField
          appearance="outlined"
          label={t("profile.name.nickname")}
          {...formProps.nicknameTH}
        /> */}
      </Columns>
    </Section>
  );
};

const EnglishNameSection: FC<{ formProps: FormControlProps }> = ({
  formProps,
}) => {
  // Translation
  const { t } = useTranslation("account");

  return (
    <Section>
      <Header level={3}>{t("profile.enName.title")}</Header>
      <Columns columns={4} className="my-3 !gap-y-12">
        <TextField
          appearance="outlined"
          label={t("profile.enName.prefix")}
          helperMsg={t("profile.enName.prefix_helper")}
          {...formProps.prefixEN}
        />
        <TextField
          appearance="outlined"
          label={t("profile.enName.firstName")}
          {...formProps.firstNameEN}
        />
        <TextField
          appearance="outlined"
          label={t("profile.enName.middleName")}
          helperMsg={t("profile.name.middleName_helper")}
          {...formProps.middleNameEN}
        />
        <TextField
          appearance="outlined"
          label={t("profile.enName.lastName")}
          {...formProps.lastNameEN}
        />
        {/* <TextField
          appearance="outlined"
          label={t("profile.enName.nickname")}
          {...formProps.nicknameEN}
        /> */}
      </Columns>
    </Section>
  );
};

const RoleSection: FC<{
  formProps: FormControlProps;
  subjectGroups: SubjectGroup[];
}> = ({ formProps, subjectGroups }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("account");

  return (
    <Section>
      <Header level={3}>{t("profile.role.title")}</Header>
      <Columns columns={4} className="mt-3 mb-8 !gap-y-12">
        <Select
          appearance="outlined"
          label={t("profile.role.subjectGroup")}
          helperMsg={t("profile.role.subjectGroup_helper")}
          {...formProps.subjectGroup}
        >
          {subjectGroups.map((subjectGroup) => (
            <MenuItem key={subjectGroup.id} value={subjectGroup.id}>
              {getLocaleString(subjectGroup.name, locale)}
            </MenuItem>
          ))}
        </Select>
        <TextField
          appearance="outlined"
          label={t("profile.role.classAdvisorAt")}
          helperMsg={t("profile.role.classAdvisorAt_helper")}
          {...formProps.classAdvisorAt}
        />
      </Columns>
    </Section>
  );
};

const MiscellaneousSection: FC<{ formProps: FormControlProps }> = ({
  formProps,
}) => {
  // Translation
  const { t } = useTranslation("account");

  return (
    <Section>
      <Header level={3}>{t("profile.general.title")}</Header>
      <Columns columns={4} className="my-3 !gap-y-12">
        {/* <Select
          appearance="outlined"
          label={t("profile.general.gender.label")}
          {...formProps.gender}
        >
          <MenuItem value="male">{t("profile.general.gender.male")}</MenuItem>
          <MenuItem value="female">
            {t("profile.general.gender.female")}
          </MenuItem>
          <MenuItem value="non-binary">
            {t("profile.general.gender.nonBinary")}
          </MenuItem>
          <MenuItem value="no-response">
            {t("profile.general.gender.noReponse")}
          </MenuItem>
        </Select> */}
        <TextField
          appearance="outlined"
          label={t("profile.general.birthDate")}
          inputAttr={{ type: "date" }}
          {...formProps.birthdate}
        />
        {/* <TextField
          appearance="outlined"
          label={t("profile.general.citizenID")}
          leading={<MaterialIcon icon="lock" />}
          helperMsg={t("profile.common.privateInfo_helper")}
          inputAttr={{ type: "number" }}
          {...formProps.citizenID}
        /> */}
        {/* <TextField
          appearance="outlined"
          label={t("profile.general.passportNumber")}
          leading={<MaterialIcon icon="lock" />}
          helperMsg={t("profile.common.privateInfo_helper")}
          {...formProps.passportNumber}
        /> */}
        {/* <Select
          appearance="outlined"
          label={t("profile.general.bloodGroup")}
          leading={<MaterialIcon icon="lock" />}
          helperMsg={t("profile.common.privateInfo_helper")}
          {...formProps.bloodGroup}
        >
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="AB">AB</MenuItem>
          <MenuItem value="O">O</MenuItem>
        </Select> */}
      </Columns>
    </Section>
  );
};

const ContactsSection: FC<{
  contacts: Contact[];
  setContacts: (value: Contact[]) => void;
}> = ({ contacts, setContacts }) => {
  // Translation
  const { t } = useTranslation("account");

  // Dialog control
  const [showAdd, setShowAdd] = useState<boolean>(false);

  return (
    <Section sectionAttr={{ "aria-labelledby": "header-contacts" }}>
      <Columns columns={3} className="!items-end">
        <Header className="md:col-span-2" hAttr={{ id: "header-contacts" }}>
          {t("profile.contacts.title")}
        </Header>
        <Actions>
          <Button
            appearance="tonal"
            icon={<MaterialIcon icon="add" />}
            onClick={() => setShowAdd(true)}
          >
            {t("profile.contacts.action.add")}
          </Button>
          <ContactDialog
            open={showAdd}
            onClose={() => setShowAdd(false)}
            onSubmit={(contact) => {
              setShowAdd(false);
              setContacts([...contacts, contact]);
            }}
          />
        </Actions>
      </Columns>
      {contacts.length ? (
        <Columns columns={4}>
          {contacts.map((contact, idx) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onChange={(contact) =>
                setContacts(changeItem<Contact>(contact, idx, contacts))
              }
              onRemove={() =>
                setContacts(contacts.filter((item) => contact.id !== item.id))
              }
            />
          ))}
        </Columns>
      ) : (
        <Card
          appearance="outlined"
          className="box-content !grid h-[4.5rem] place-content-center"
        >
          <p className="skc-body-medium text-on-surface-variant">
            {t("profile.contacts.noContacts")}
          </p>
        </Card>
      )}
    </Section>
  );
};

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
  const { form, formProps } = useForm<
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
    | "bloodGroup"
  >([
    { key: "prefixTH", required: true, defaultValue: person.prefix.th },
    {
      key: "firstNameTH",
      required: true,
      defaultValue: person.name.th.firstName,
    },
    { key: "middleNameTH", defaultValue: person.name.th.middleName },
    {
      key: "lastNameTH",
      required: true,
      defaultValue: person.name.th.lastName,
    },
    { key: "nicknameTH" },
    { key: "prefixEN", required: true, defaultValue: person.prefix["en-US"] },
    {
      key: "firstNameEN",
      required: true,
      defaultValue: person.name["en-US"]?.firstName,
    },
    { key: "middleNameEN", defaultValue: person.name["en-US"]?.middleName },
    {
      key: "lastNameEN",
      required: true,
      defaultValue: person.name["en-US"]?.lastName,
    },
    { key: "nicknameEN" },
    {
      key: "subjectGroup",
      defaultValue:
        person.role === "teacher" && subjectGroups.length
          ? subjectGroups[0].id
          : undefined,
    },
    {
      key: "classAdvisorAt",
      defaultValue:
        person.role === "teacher" ? person.classAdvisorAt?.number : undefined,
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
    // { key: "bloodGroup", required: true },
  ]);
  const [contacts, setContacts] = useState<Contact[]>(person.contacts);

  // Form submission
  const [loading, toggleLoading] = useToggle();
  async function handleSubmit() {
    withLoading(async () => {
      const { error } = await setupPerson(
        supabase,
        { ...form, contacts },
        person
      );

      if (error) {
        setSnackbar(
          <Snackbar>{t("snackbar.failure", { ns: "common" })}</Snackbar>
        );
        return false;
      }

      router.push("/account/welcome/covid-19-safety");
      return true;
    }, toggleLoading);
  }

  return (
    <>
      <Head>
        <title>{createTitleStr(t("yourInformation.title"), t)}</title>
      </Head>
      <ContentLayout>
        <NextWarningCard />
        <Section className="pb-6">
          <Header>{t("yourInformation.general.title")}</Header>
          <p className="-mt-2">{t("yourInformation.general.desc")}</p>
          <p className="-mt-2">
            <Trans i18nKey="yourInformation.general.inControl" ns="welcome">
              <Link href="/help/essentials/onboarding" className="link">
                ทำไมโรงเรียนจึงต้องขอข้อมูลนี้
              </Link>
            </Trans>
          </p>
          <ThaiNameSection formProps={formProps} />
          <EnglishNameSection formProps={formProps} />
          {person.role === "teacher" ? (
            <RoleSection formProps={formProps} subjectGroups={subjectGroups} />
          ) : (
            <></>
          )}
          <MiscellaneousSection formProps={formProps} />
        </Section>
        <ContactsSection contacts={contacts} setContacts={setContacts} />
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
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: person } = await getPersonFromUser(
    supabase,
    session!.user as User,
    { contacts: true }
  );

  const { data: subjectGroups } = await getSubjectGroups();

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
        "account",
      ])),
      person,
      subjectGroups,
    },
  };
};

WelcomePage.pageHeader = {
  title: { key: "yourInformation.title", ns: "welcome" },
  icon: <MaterialIcon icon="badge" />,
  parentURL: "/account/welcome",
};

WelcomePage.childURLs = ["/account/welcome/your-information"];

export default WelcomePage;
