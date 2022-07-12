// Modules
import type { GetStaticProps, NextPage } from "next";
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
import { createTitleStr } from "@utils/helpers/title";

const LoginForm = () => {
  const { t } = useTranslation("account");
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

    // Signals loading
    setLoading(true);

    // Validates
    if (!validate()) return;

    // Sends and redirects
    const { user, session, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    if (user?.user_metadata.role == "student") router.push("/s/home");
    else if (user?.user_metadata.role == "teacher") router.push("/t/home");
  }

  return (
    <div className="flex flex-col items-center">
      <form
        className="section w-full sm:w-1/2 md:w-1/3"
        onSubmit={(e: FormEvent) => handleSubmit(e)}
      >
        <div>
          <KeyboardInput
            name="user-id"
            type="email"
            label={t("form.email")}
            helperMsg={t("form.email_helper")}
            errorMsg={t("form.email_error")}
            useAutoMsg
            onChange={(e: string) => setEmail(e)}
          />
          <KeyboardInput
            name="password"
            type="password"
            label={t("form.password")}
            helperMsg={t("form.password_helper")}
            onChange={(e: string) => setPassword(e)}
          />
        </div>
        <div className="flex flex-row flex-wrap items-center justify-end gap-2">
          <Link href="/account/forgot-password">
            <a className="btn--text">{t("action.forgotPassword")}</a>
          </Link>
          <FormButton
            label={t("action.logIn")}
            type="submit"
            appearance="filled"
            disabled={!validate() || loading}
          />
        </div>
      </form>
    </div>
  );
};

// Page
const Login: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["account", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon={<MaterialIcon icon="person" />}
            backGoesTo="/"
            LinkElement={Link}
            className="sm:none"
            key="title"
          />
        }
      >
        <LoginForm />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "account"])),
  },
});

export default Login;
