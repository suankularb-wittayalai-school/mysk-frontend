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
  const router = useRouter();

  const [loading, toggleLoading] = useToggle();
  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  function validate(): boolean {
    if (form.newPassword.length < 8) return false;
    if (form.confirmNewPassword.length < 8) return false;
    if (form.newPassword != form.confirmNewPassword) return false;
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    toggleLoading();
    const { data } = await supabase.auth.update({ password: form.newPassword });
    if (data) router.push("/account/login");
    toggleLoading();
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
            pageIcon={<MaterialIcon icon="lock" />}
            backGoesTo="/account/login"
            LinkElement={Link}
          />
        }
      >
        <LayoutGridCols cols={3}>
          <div className="mb-4 !p-0 sm:mb-0 md:col-span-2">
            <Image
              src="/images/graphics/forgot-password.webp"
              width={384}
              height={216}
              alt={t("forgor.graphicAlt")}
              layout="responsive"
              className="sm:rounded-2xl"
            />
          </div>
          <Section>
            <Header
              icon={<MaterialIcon icon="password" allowCustomSize />}
              text={t("forgor.newPassword")}
            />
            <p>{t("forgor.supportingText")}</p>
            <form onSubmit={handleSubmit}>
              <KeyboardInput
                name="new-password"
                type="password"
                label={t("dialog.changePassword.newPwd")}
                errorMsg={t("dialog.changePassword.newPwd_error")}
                useAutoMsg
                onChange={(e) => setForm({ ...form, newPassword: e })}
                attr={{ minLength: 8 }}
              />
              <KeyboardInput
                name="confirm-new-password"
                type="password"
                label={t("dialog.changePassword.confirmNewPwd")}
                errorMsg={t("dialog.changePassword.newPwd_error")}
                useAutoMsg
                onChange={(e) => setForm({ ...form, confirmNewPassword: e })}
                attr={{ minLength: 8 }}
              />
              <Actions>
                <FormButton
                  label={t("forgor.action.use")}
                  type="submit"
                  appearance="filled"
                  disabled={!validate() || loading}
                />
              </Actions>
            </form>
          </Section>
        </LayoutGridCols>
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
