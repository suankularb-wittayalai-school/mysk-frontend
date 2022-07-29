// Modules
import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
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

    // Signal loading
    setLoading(true);

    // Validate
    if (!validate()) return;

    // Send
    const { user } = await supabase.auth.signIn({ email, password });

    // Get user role
    const role = user?.user_metadata.role;

    // (@SiravitPhokeed)
    // Apparently the middleware is too fast. It immediately blocks the redirect the dashboards
    // because even though the user is authenticated, only the session knows that and the cookie
    // is in the process of being set. The middleware checks for cookie before the auth cookie
    // is set, thinks the user is not authenticated, and blocks it.
    // My crappy solution? Delay the push a bit and give some time for the cookie to be set. I’m
    // kinda comfortable with this because people with slow internet connections (whom this
    // wouldn’t work for) would probably have noticed that the Navigation has changed and clicked
    // “Home” on there instead.

    // Redirect after delay
    setTimeout(() => {
      if (role == "student") router.push("/s/home");
      else if (role == "teacher") router.push("/t/home");
    }, 10);
  }

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
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "account",
      ])),
    },
  };
};

export default Login;
