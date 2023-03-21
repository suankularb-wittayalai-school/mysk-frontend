// External libraries
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC } from "react";

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
import { CustomPage, LangCode } from "@/utils/types/common";

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

const ThaiNameSection: FC = () => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("welcome");

  // TODO: form control

  return (
    <Section>
      <Header level={3}>Thai name</Header>
      {locale !== "th" && (
        <p>
          Foreign teachers: we understand that you may not be able to fill in
          these fields by yourself, but since most students use Thai as their
          first language, you may want to find someone to transcribe your name
          into Thai for you. We apologize for the inconvenience.
        </p>
      )}
      <Columns columns={4} className="my-3 !gap-y-12">
        <TextField
          appearance="outlined"
          label="Prefix"
          helperMsg="เด็กชาย, นาย, นาง, นางสาว, etc."
        />
        <TextField appearance="outlined" label="First name" />
        <TextField
          appearance="outlined"
          label="Middle name"
          helperMsg="Leave blank if you don’t want your middle name to be
            displayed."
        />
        <TextField appearance="outlined" label="Last name" />
        <TextField appearance="outlined" label="Nickname" />
      </Columns>
    </Section>
  );
};

const EnglishNameSection: FC = () => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("welcome");

  // TODO: form control

  return (
    <Section>
      <Header level={3}>English name</Header>
      <Columns columns={4} className="my-3 !gap-y-12">
        <TextField
          appearance="outlined"
          label="English prefix"
          helperMsg="Master, Mr., Mrs., Ms., etc."
        />
        <TextField appearance="outlined" label="English first name" />
        <TextField
          appearance="outlined"
          label="English middle name"
          helperMsg="Leave blank if you don’t want your middle name to be
            displayed."
        />
        <TextField appearance="outlined" label="English last name" />
        <TextField appearance="outlined" label="English nickname" />
      </Columns>
    </Section>
  );
};

const MiscellaneousSection: FC = () => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("welcome");

  // TODO: form control

  return (
    <Section>
      <Header level={3}>Miscellaneous</Header>
      <Columns columns={4} className="my-3 !gap-y-12">
        <Select appearance="outlined" label="Gender">
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="non-binary">Non-binary</MenuItem>
          <MenuItem value="no-response">Prefer not to respond</MenuItem>
        </Select>
        <TextField
          appearance="outlined"
          label="Birthdate"
          inputAttr={{ type: "date" }}
        />
        <TextField
          appearance="outlined"
          label="Citizen ID"
          leading={<MaterialIcon icon="lock" />}
          helperMsg="Only people you allow access to this information can see
            it."
        />
        <TextField
          appearance="outlined"
          label="Passport number"
          leading={<MaterialIcon icon="lock" />}
          helperMsg="Only people you allow access to this information can see
            it."
        />
        <Select
          appearance="outlined"
          label="Blood group"
          leading={<MaterialIcon icon="lock" />}
          helperMsg="Only people you allow access to this information can see
            it."
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
  const locale = useLocale();
  const { t } = useTranslation("welcome");

  // TODO: form control

  return (
    <Section>
      <Columns columns={3}>
        <Header className="md:col-span-2">Contacts</Header>
        <Actions>
          <Button appearance="tonal" icon={<MaterialIcon icon="add" />}>
            Add contact
          </Button>
        </Actions>
      </Columns>
      <Card appearance="outlined" className="!grid h-20 place-content-center">
        <p className="skc-body-medium text-on-surface-variant">
          No contacts added yet.
        </p>
      </Card>
    </Section>
  );
};

const WelcomePage: CustomPage = () => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

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
          <ThaiNameSection />
          <EnglishNameSection />
          <MiscellaneousSection />
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
