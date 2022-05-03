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
  KeyboardInput,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Supabase
import { supabase } from "@utils/supabaseClient";

const LoginForm = () => {
  const { t } = useTranslation("account");
  const router = useRouter();

  // Form control
  const [form, setForm] = useState<{
    userID: string;
    password: string;
  }>({
    userID: "",
    password: "",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    let formData: FormData = new FormData();

    // Validates
    if (!form.userID) return;
    if (!form.password) return;

    // Sends and redirects
    const { user, session, error } = await supabase.auth.signIn({
      email: form.userID,
      password: form.password,
    });

    if (error) {
      console.log(error);
      return;
    }

    if (user?.user_metadata.role == "student") router.push("/s/home");
    else if (user?.user_metadata.role == "teacher") router.push("/t/home");
  }

  return (
    <div className="flex flex-col items-center">
      <form
        className="section w-full sm:w-1/2 md:w-1/3"
        onSubmit={(e: FormEvent) => e.preventDefault()}
      >
        <div>
          <KeyboardInput
            name="user-id"
            type="email"
            label={t("form.email")}
            helperMsg="Use your school email."
            // errorMsg="Invalid email."
            useAutoMsg
            onChange={(e: string) => setForm({ ...form, userID: e })}
            className="w-full"
          />
          <KeyboardInput
            name="password"
            type="password"
            label={t("form.password")}
            helperMsg="Default is birthday in YYYYMMDD (in AD), i.e. 20040512"
            onChange={(e: string) => setForm({ ...form, password: e })}
            className="w-full"
          />
        </div>
        <div className="flex flex-row flex-wrap items-center justify-end gap-2">
          <Link href="/account/forgot-password">
            <a className="btn--text">{t("action.forgotPassword")}</a>
          </Link>
          <button className="btn--filled" onClick={(e) => handleSubmit(e)}>
            {t("action.logIn")}
          </button>
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
        <title>
          {t("title")} - {t("brand.name", { ns: "common" })}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon="person"
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
