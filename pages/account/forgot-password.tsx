// External libraries
import type { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
  TextField,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Helpers
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

const ForgotPasswordPage: CustomPage = () => {
  const { t } = useTranslation("account");
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [loading, toggleLoading] = useToggle();
  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  function validate(): boolean {
    if (form.newPassword.length < 8) return false;
    if (form.confirmNewPassword.length < 8) return false;
    if (form.newPassword !== form.confirmNewPassword) return false;
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;

    withLoading(async () => {
      const { data, error } = await supabase.auth.updateUser({
        password: form.newPassword,
      });

      if (error) {
        console.error(error);
        return false;
      }

      if (data) router.push("/");
      return true;
    }, toggleLoading);
  }

  return (
    <>
      <Head>
        <title>{createTitleStr(t("forgor.title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("forgor.title")}
        icon={<MaterialIcon icon="lock" />}
        parentURL="/"
      />
      <ContentLayout>
        <Columns columns={3}>
          <Image
            src="/images/graphics/forgot-password.webp"
            width={384}
            height={216}
            alt={t("forgor.graphicAlt")}
            priority
            className="mb-4 -mt-8 w-full sm:my-0 sm:rounded-xl md:col-span-2"
          />
          <Section>
            <Header>{t("forgor.newPassword")}</Header>
            <p className="skc-body-medium mb-4">{t("forgor.supportingText")}</p>
            <div className="flex flex-col gap-8">
              <TextField
                appearance="outlined"
                label={t("dialog.changePassword.newPwd")}
                helperMsg={
                  form.newPassword.length > 1 && form.newPassword.length < 8
                    ? t("dialog.changePassword.newPwd_error")
                    : undefined
                }
                required
                error={
                  form.newPassword.length > 1 && form.newPassword.length < 8
                }
                value={form.newPassword}
                onChange={(value) =>
                  setForm({ ...form, newPassword: value as string })
                }
                inputAttr={{ type: "password", minLength: 8 }}
              />
              <TextField
                appearance="outlined"
                label={t("dialog.changePassword.confirmNewPwd")}
                helperMsg={
                  form.newPassword !== form.confirmNewPassword
                    ? t("dialog.changePassword.confirmNewPwd_error")
                    : undefined
                }
                required
                error={form.newPassword !== form.confirmNewPassword}
                value={form.confirmNewPassword}
                onChange={(value) =>
                  setForm({ ...form, confirmNewPassword: value as string })
                }
                inputAttr={{ type: "password", minLength: 8 }}
              />
              <Actions>
                <Button
                  appearance="filled"
                  loading={loading || undefined}
                  onClick={handleSubmit}
                >
                  {t("forgor.action.use")}
                </Button>
              </Actions>
            </div>
          </Section>
        </Columns>
      </ContentLayout>
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

export default ForgotPasswordPage;
