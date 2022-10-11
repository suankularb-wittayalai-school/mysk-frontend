// Modules
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FormEvent, useState } from "react";

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

const ForgotPassword: NextPage = () => {
  const { t } = useTranslation("account");
  const [email, setEmail] = useState<string>("");
  const [sent, toggleSent] = useToggle();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(
      email
    );
    if (data) toggleSent();
  }

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
          <Section className="mt-7 sm:mt-0">
            <Header
              icon={<MaterialIcon icon="email" allowCustomSize />}
              text="Reset with email"
            />
            <p>
              To verify your identity, we will send you an email with a link
              back to MySK.
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
                  label="Send"
                  type="submit"
                  appearance="filled"
                  disabled={!email || sent}
                />
              </Actions>
            </form>
          </Section>
        </LayoutGridCols>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
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
