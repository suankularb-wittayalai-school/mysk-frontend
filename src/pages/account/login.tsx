// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FormEvent, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  FormButton,
  KeyboardInput,
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Components
import ForgotPasswordDialog from "@components/dialogs/account/ForgotPassword";

// Backend
import { setAuthCookies } from "@utils/backend/account";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { LangCode } from "@utils/types/common";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Page
const Login: NextPage = () => {
  const { t } = useTranslation("account");
  const router = useRouter();

  // Form control
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Dialog control
  const [showForgot, toggleShowForgot] = useToggle();

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
        <div className="lg:px-[14.28125rem]">
          <LayoutGridCols cols={2}>
            <div className="hidden aspect-[3/4] w-full !p-0 sm:block">
              <Image
                src="/images/graphics/login.png"
                width={720}
                height={960}
                alt={t("logIn.graphicAlt")}
                layout="responsive"
                objectFit="contain"
                className="rounded-2xl"
              />
            </div>
            <form
              className="section"
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
              <Actions>
                <Button
                  label={t("logIn.action.forgotPassword")}
                  type="text"
                  onClick={toggleShowForgot}
                />
                <FormButton
                  label={t("logIn.action.logIn")}
                  type="submit"
                  appearance="filled"
                  disabled={!validate() || loading}
                />
              </Actions>
            </form>
          </LayoutGridCols>
        </div>
      </RegularLayout>

      {/* Dialogs */}
      <ForgotPasswordDialog
        show={showForgot}
        onClose={toggleShowForgot}
        inputEmail={email}
      />
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

export default Login;
