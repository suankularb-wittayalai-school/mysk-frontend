// Modules
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FormEvent, useState } from "react";

// SK Components
import {
  FormButton,
  KeyboardInput,
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Helpers
import { createTitleStr } from "@utils/helpers/title";
import { setAuthCookies } from "@utils/backend/account";
import { LangCode } from "@utils/types/common";

// Page
const Login: NextPage = () => {
  const { t } = useTranslation(["account", "common"]);
  const router = useRouter();

  // Form control
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Loading
  const [loading, setLoading] = useState<boolean>(false);

  function validate(): boolean {
    if (!email) return false;
    if (!password) return false;

    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Disable Log in Button
    setLoading(true);

    // Validate response
    if (!validate()) return;

    // Log in user in Supabase
    const { session } = await supabase.auth.signIn({ email, password });
    if (!session) {
      setLoading(false);
      return;
    }

    // Set auth cookies
    const cookiesOK = await setAuthCookies("SIGNED_IN", session);

    // When auth cookies are set, redirect
    if (cookiesOK) {
      const role = session.user?.user_metadata.role;
      if (role == "teacher") router.push("/teach");
      if (role == "student") router.push("/learn");
      return;
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>{createTitleStr(t("logIn.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("logIn.title") }}
            pageIcon={<MaterialIcon icon="person" />}
            backGoesTo="/"
            LinkElement={Link}
            className="sm:none"
            key="title"
          />
        }
      >
        <div className="flex flex-col items-center">
          <form
            className="section w-full sm:w-1/2 md:w-1/3"
            onSubmit={(e: FormEvent) => handleSubmit(e)}
          >
            <div>
              <KeyboardInput
                name="user-id"
                type="email"
                label={t("logIn.form.email")}
                helperMsg={t("logIn.form.email_helper")}
                errorMsg={t("logIn.form.email_error")}
                useAutoMsg
                onChange={(e: string) => setEmail(e)}
              />
              <KeyboardInput
                name="password"
                type="password"
                label={t("logIn.form.password")}
                helperMsg={t("logIn.form.password_helper")}
                onChange={(e: string) => setPassword(e)}
              />
            </div>
            <div className="flex flex-row flex-wrap items-center justify-end gap-2">
              <Link href="/account/forgot-password">
                <a className="btn--text">{t("logIn.action.forgotPassword")}</a>
              </Link>
              <FormButton
                label={t("logIn.action.logIn")}
                type="submit"
                appearance="filled"
                disabled={!validate() || loading}
              />
            </div>
          </form>
        </div>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
    },
  };
};

export default Login;
