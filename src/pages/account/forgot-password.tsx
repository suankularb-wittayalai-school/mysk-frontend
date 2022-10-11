// Modules
import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FormEvent, useEffect, useState } from "react";

// SK Components
import {
  Actions,
  FormButton,
  Header,
  KeyboardInput,
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { LangCode } from "@utils/types/common";

const EmailSection = ({
  toggleSent: toggleExtSent,
}: {
  toggleSent: () => void;
}): JSX.Element => {
  const { t } = useTranslation("account");

  const [email, setEmail] = useState<string>("");
  const [sent, toggleSent] = useToggle();
  useEffect(toggleExtSent, [sent]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(
      email
    );
    if (data) toggleSent();
  }

  return (
    <Section className="mt-7 sm:mt-0">
      <Header
        icon={<MaterialIcon icon="email" allowCustomSize />}
        text={t("forgor.resetWithEmail")}
      />
      <p>
        To verify your identity, we will send you an email with a link back to
        MySK.
      </p>
      <form onSubmit={handleSubmit}>
        <KeyboardInput
          name="email"
          type="email"
          label={t("logIn.form.email")}
          helperMsg={t("logIn.form.email_helper")}
          errorMsg={t("logIn.form.email_error")}
          useAutoMsg
          onChange={setEmail}
          attr={{ autoFocus: true, disabled: sent }}
        />
        <Actions>
          <FormButton
            label={t("forgor.action.send")}
            type="submit"
            appearance="filled"
            disabled={!email || sent}
          />
        </Actions>
      </form>
    </Section>
  );
};

const NewPwdSection = (): JSX.Element => {
  const { t } = useTranslation("account");

  const [password, setPassword] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="password" allowCustomSize />}
        text={t("forgor.newPassword")}
      />
      <LayoutGridCols cols={3}>
        <form onSubmit={handleSubmit}>
          <KeyboardInput
            name="password"
            type="password"
            label={t("forgor.form.password")}
            useAutoMsg
            onChange={setPassword}
            attr={{ autoFocus: true }}
          />
          <Actions>
            <FormButton
              label={t("forgor.action.use")}
              type="submit"
              appearance="filled"
              disabled={!password}
            />
          </Actions>
        </form>
      </LayoutGridCols>
    </Section>
  );
};

const ForgotPassword: NextPage = () => {
  const { t } = useTranslation("account");
  const [sent, toggleSent] = useToggle();

  return (
    <>
      <Head>
        <title>{createTitleStr(t("forgor.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("forgor.title") }}
            pageIcon={<MaterialIcon icon="person" />}
            backGoesTo="/account/login"
            LinkElement={Link}
          />
        }
      >
        <LayoutGridCols cols={3}>
          <div className="!p-0">
            <Image
              src="/images/graphics/password-reset.png"
              width={384}
              height={216}
              alt="Lock icon hanging on a thread"
              layout="responsive"
              className="sm:rounded-2xl"
            />
          </div>
          <EmailSection toggleSent={toggleSent} />
        </LayoutGridCols>
        <NewPwdSection />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
    },
  };
};

export default ForgotPassword;
