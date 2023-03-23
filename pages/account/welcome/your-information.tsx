// External libraries
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useState } from "react";

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
  TextField,
} from "@suankularb-components/react";

// Internal components
import AddContactDialog from "@/components/account/AddContactDialog";
import ContactCard from "@/components/account/ContactCard";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";
import {
  validateCitizenID,
  validatePassport,
} from "@/utils/helpers/validators";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useForm } from "@/utils/hooks/form";

// Types
import { CustomPage, FormControlProps, LangCode } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";

const NextWarningCard: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Card
      appearance="outlined"
      direction="row"
      className="mx-4 items-center gap-3 py-3 px-4 sm:mx-0"
    >
      <MaterialIcon icon="warning" className="text-error" />
      <p>{t("common.nextReminder")}</p>
    </Card>
  );
};

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
        <TextField
          appearance="outlined"
          label={t("profile.name.nickname")}
          {...formProps.nicknameTH}
        />
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
        <TextField
          appearance="outlined"
          label={t("profile.enName.nickname")}
          {...formProps.nicknameEN}
        />
      </Columns>
    </Section>
  );
};

const RoleSection: FC<{ formProps: FormControlProps }> = ({ formProps }) => {
  // Translation
  const { t } = useTranslation("account");

  return (
    <Section>
      <Header level={3}>{t("profile.role.title")}</Header>
      <Columns columns={4} className="mt-3 mb-8 !gap-y-12">
        <TextField
          appearance="outlined"
          label={t("profile.role.subjectGroup")}
          helperMsg={t("profile.role.subjectGroup_helper")}
          {...formProps.subjectGroup}
        />
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
        <Select
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
        </Select>
        <TextField
          appearance="outlined"
          label={t("profile.general.birthDate")}
          inputAttr={{ type: "date" }}
          {...formProps.birthdate}
        />
        <TextField
          appearance="outlined"
          label={t("profile.general.citizenID")}
          leading={<MaterialIcon icon="lock" />}
          helperMsg={t("profile.common.privateInfo_helper")}
          {...formProps.citizenID}
        />
        <TextField
          appearance="outlined"
          label={t("profile.general.passportNumber")}
          leading={<MaterialIcon icon="lock" />}
          helperMsg={t("profile.common.privateInfo_helper")}
          {...formProps.passportNumber}
        />
        <Select
          appearance="outlined"
          label={t("profile.general.bloodGroup")}
          leading={<MaterialIcon icon="lock" />}
          helperMsg="Only people you allow access to this information can see
            it."
          {...formProps.bloodGroup}
        >
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="AB">AB</MenuItem>
          <MenuItem value="O">O</MenuItem>
        </Select>
      </Columns>
    </Section>
  );
};

const ContactsSection: FC = () => {
  // Translation
  const { t } = useTranslation("account");

  // Form control
  const [contacts, setContacts] = useState<Contact[]>([]);

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
          <AddContactDialog
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
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onChange={() => {}}
              onRemove={() => {}}
            />
          ))}
        </Columns>
      ) : (
        <Card
          appearance="outlined"
          className="!grid h-[4.375rem] place-content-center"
        >
          <p className="skc-body-medium text-on-surface-variant">
            {t("profile.contacts.noContacts")}
          </p>
        </Card>
      )}
    </Section>
  );
};

const WelcomePage: CustomPage = () => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation(["welcome", "common"]);

  const { formProps } = useForm<
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
    { key: "prefixTH", required: true },
    { key: "firstNameTH", required: true },
    { key: "middleNameTH" },
    { key: "lastNameTH", required: true },
    { key: "nicknameTH" },
    { key: "prefixEN", required: true },
    { key: "firstNameEN", required: true },
    { key: "middleNameEN" },
    { key: "lastNameEN", required: true },
    { key: "nicknameEN" },
    { key: "subjectGroup" },
    { key: "classAdvisorAt" },
    { key: "gender", required: true },
    {
      key: "citizenID",
      required: locale === "th",
      validate: (value) =>
        validateCitizenID(value) ||
        t("profile.general.citizenID_error", { ns: "account" }),
    },
    {
      key: "passportNumber",
      validate: (value) =>
        Boolean(validatePassport(value)) ||
        t("profile.general.passportNumber_error", { ns: "account" }),
    },
    { key: "bloodGroup", required: true },
  ]);

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
          <RoleSection formProps={formProps} />
          <MiscellaneousSection formProps={formProps} />
        </Section>
        <ContactsSection />
        <Actions className="mx-4 sm:mx-0">
          <Button
            appearance="filled"
            href="/account/welcome/covid-19-safety"
            element={Link}
          >
            {t("common.action.next")}
          </Button>
        </Actions>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, [
      "common",
      "welcome",
      "account",
    ])),
  },
});

WelcomePage.pageHeader = {
  title: { key: "yourInformation.title", ns: "welcome" },
  icon: <MaterialIcon icon="badge" />,
  parentURL: "/account/welcome",
};

WelcomePage.childURLs = ["/account/welcome/your-information"];

export default WelcomePage;
