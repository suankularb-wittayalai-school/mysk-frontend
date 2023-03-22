// External libraries
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  MenuItem,
  Section,
  Select,
  TextField,
} from "@suankularb-components/react";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, FormControlProps, LangCode } from "@/utils/types/common";
import { useForm } from "@/utils/hooks/form";
import {
  validateCitizenID,
  validatePassport,
} from "@/utils/helpers/validators";
import AddContactDialog from "@/components/account/AddContactDialog";
import { Contact } from "@/utils/types/contact";
import ContactCard from "@/components/account/ContactCard";

const NextWarningCard: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Card
      appearance="outlined"
      className="mx-4 !flex-row gap-3 py-3 px-4 sm:mx-0"
    >
      <MaterialIcon icon="warning" className="text-error" />
      <p>Remember: your information is not saved until you press “Next.”</p>
    </Card>
  );
};

const GivingInformationCard: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Card appearance="outlined" className="mx-4 sm:mx-0">
      <CardHeader title="Why should I give my information?" />
      <CardContent>
        <p>
          People inside the school can search for basic information about you,
          like your name and contacts, via MySK Lookup. More private
          information, your citizen ID, for instance, can only be seen by the
          people you give explicit approval to.
        </p>
        <p>
          Don’t worry; no information is shared without your knowledge and no
          one outside the school have access to your data, not even parents.
        </p>
      </CardContent>
    </Card>
  );
};

const ThaiNameSection: FC<{ formProps: FormControlProps }> = ({
  formProps,
}) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("welcome");

  return (
    <Section>
      <Header level={3}>Thai name</Header>
      {locale !== "th" ? (
        <p>
          Foreign teachers: we understand that you may not be able to fill in
          these fields by yourself, but since most students use Thai as their
          first language, you may want to find someone to transcribe your name
          into Thai for you. We apologize for the inconvenience.
        </p>
      ) : (
        <></>
      )}
      <Columns columns={4} className="my-3 !gap-y-12">
        <TextField
          appearance="outlined"
          label="Prefix"
          helperMsg="เด็กชาย, นาย, นาง, นางสาว, etc."
          {...formProps.prefixTH}
        />
        <TextField
          appearance="outlined"
          label="First name"
          {...formProps.firstNameTH}
        />
        <TextField
          appearance="outlined"
          label="Middle name"
          helperMsg="Leave blank if you don’t want your middle name to be
            displayed."
          {...formProps.middleNameTH}
        />
        <TextField
          appearance="outlined"
          label="Last name"
          {...formProps.lastNameTH}
        />
        <TextField
          appearance="outlined"
          label="Nickname"
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
  const locale = useLocale();
  const { t } = useTranslation("welcome");

  return (
    <Section>
      <Header level={3}>English name</Header>
      <Columns columns={4} className="my-3 !gap-y-12">
        <TextField
          appearance="outlined"
          label="English prefix"
          helperMsg="Master, Mr., Mrs., Ms., etc."
          {...formProps.prefixEN}
        />
        <TextField
          appearance="outlined"
          label="English first name"
          {...formProps.firstNameEN}
        />
        <TextField
          appearance="outlined"
          label="English middle name"
          helperMsg="Leave blank if you don’t want your middle name to be
            displayed."
          {...formProps.middleNameEN}
        />
        <TextField
          appearance="outlined"
          label="English last name"
          {...formProps.lastNameEN}
        />
        <TextField
          appearance="outlined"
          label="English nickname"
          {...formProps.nicknameEN}
        />
      </Columns>
    </Section>
  );
};

const MiscellaneousSection: FC<{ formProps: FormControlProps }> = ({
  formProps,
}) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("welcome");

  return (
    <Section>
      <Header level={3}>Miscellaneous</Header>
      <Columns columns={4} className="my-3 !gap-y-12">
        <Select appearance="outlined" label="Gender" {...formProps.gender}>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="non-binary">Non-binary</MenuItem>
          <MenuItem value="no-response">Prefer not to respond</MenuItem>
        </Select>
        <TextField
          appearance="outlined"
          label="Birthdate"
          inputAttr={{ type: "date" }}
          {...formProps.birthdate}
        />
        <TextField
          appearance="outlined"
          label="Citizen ID"
          leading={<MaterialIcon icon="lock" />}
          helperMsg="Only people you allow access to this information can see
            it."
          {...formProps.citizenID}
        />
        <TextField
          appearance="outlined"
          label="Passport number"
          leading={<MaterialIcon icon="lock" />}
          helperMsg="Only people you allow access to this information can see
            it."
          {...formProps.passportNumber}
        />
        <Select
          appearance="outlined"
          label="Blood group"
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
  const { t } = useTranslation("welcome");

  // Form control
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Dialog control
  const [showAdd, setShowAdd] = useState<boolean>(false);

  return (
    <Section sectionAttr={{ "aria-labelledby": "header-contacts" }}>
      <Columns columns={3}>
        <Header className="md:col-span-2" hAttr={{ id: "header-contacts" }}>
          Contacts
        </Header>
        <Actions>
          <Button
            appearance="tonal"
            icon={<MaterialIcon icon="add" />}
            onClick={() => setShowAdd(true)}
          >
            Add contact
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
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </Columns>
      ) : (
        <Card appearance="outlined" className="!grid h-20 place-content-center">
          <p className="skc-body-medium text-on-surface-variant">
            No contacts added yet.
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
    { key: "gender", required: true },
    {
      key: "citizenID",
      required: locale === "th",
      validate: validateCitizenID,
    },
    {
      key: "passportNumber",
      validate: (value) => Boolean(validatePassport(value)),
    },
    { key: "bloodGroup", required: true },
  ]);

  return (
    <>
      <Head>
        <title>{createTitleStr("Your information", t)}</title>
      </Head>
      <ContentLayout>
        <NextWarningCard />
        <GivingInformationCard />
        <Section className="pb-6">
          <Header>General information</Header>
          <p className="-mt-2">
            We have already imported some fields from relevant organizations in
            the school. Please check for any inaccuracies in the import.
          </p>
          <ThaiNameSection formProps={formProps} />
          <EnglishNameSection formProps={formProps} />
          <MiscellaneousSection formProps={formProps} />
        </Section>
        <ContactsSection />
        <Actions className="mx-4 sm:mx-0">
          <Button
            appearance="filled"
            href="/account/welcome/covid-19-safety"
            element={Link}
          >
            Next
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
  title: "Your information",
  icon: <MaterialIcon icon="waving_hand" />,
  parentURL: "/account/welcome",
};

WelcomePage.childURLs = ["/account/welcome/your-information"];

export default WelcomePage;
