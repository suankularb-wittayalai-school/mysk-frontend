// External libraries
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
  TextField,
} from "@suankularb-components/react";

// Internal components
import BlockingPane from "@/components/common/BlockingPane";
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Helpers
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import type { CustomPage, LangCode } from "@/utils/types/common";

const LastPageCard: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Card
      appearance="outlined"
      direction="row"
      className="mx-4 items-center gap-3 px-4 py-3 sm:mx-0"
    >
      <MaterialIcon icon="info" className="text-on-surface-variant" />
      <p>{t("loggingIn.lastPage")}</p>
    </Card>
  );
};

const CheckEmailSection: FC<{ user: User }> = ({ user }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("welcome");

  // Supabase
  const supabase = useSupabaseClient();

  // Form control
  const [email, setEmail] = useState<string>("");

  const [loading, toggleLoading] = useToggle();
  const [success, toggleSuccess] = useToggle();
  const [notNeeded, toggleNotNeeded] = useToggle();

  function handleSubmit() {
    withLoading(
      async () => {
        if ([email, "sk.ac.th"].join("") === user.email) {
          toggleNotNeeded();
          return true;
        }

        const { error } = await supabase.auth.updateUser({
          email: [email, "sk.ac.th"].join(""),
        });
        if (error) {
          console.error(error);
          return false;
        }

        toggleSuccess();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }

  return (
    <Section className="relative">
      <BlockingPane
        icon={<MaterialIcon icon="email" size={48} />}
        open={success}
      >
        <Trans i18nKey="loggingIn.checkEmail.success" ns="welcome">
          <Link href="/help/essentials/onboarding" className="link" />
        </Trans>
      </BlockingPane>

      <BlockingPane
        icon={<MaterialIcon icon="check" size={48} />}
        open={notNeeded}
      >
        {t("loggingIn.checkEmail.notNeeded")}
      </BlockingPane>

      <Header>{t("loggingIn.checkEmail.title")}</Header>
      <p>{t("loggingIn.checkEmail.desc", { email: user.email })}</p>
      <Columns columns={6}>
        <TextField
          appearance="outlined"
          label={t("loggingIn.checkEmail.form.email")}
          align="right"
          trailing="sk.ac.th"
          error={email.endsWith("sk.ac.th")}
          value={email}
          onChange={(value) =>
            setEmail(
              (value as string).endsWith("sk.ac.th")
                ? (value as string).slice(0, -8)
                : (value as string)
            )
          }
          locale={locale}
          inputAttr={{ autoCapitalize: "off" }}
          className="col-span-4 md:col-start-2"
        />
      </Columns>
      <Actions>
        <Button
          appearance="tonal"
          loading={loading || undefined}
          onClick={handleSubmit}
        >
          {t("loggingIn.checkEmail.action.send")}
        </Button>
      </Actions>
    </Section>
  );
};

const CreatePasswordSection: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  // Supabase
  const supabase = useSupabaseClient();
  const user = useUser();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, toggleLoading] = useToggle();
  const [success, toggleSuccess] = useToggle();
  function handleSubmit() {
    withLoading(
      async () => {
        // Set new password
        const { error: pwdError } = await supabase.auth.updateUser({
          password: form.password,
        });
        if (pwdError) {
          console.error(pwdError);
          return false;
        }

        // Flag the user as onboarded

        // In Supabase’s internals
        const { error: sbUserError } = await supabase.auth.updateUser({
          data: { onboarded: true },
        });
        if (sbUserError) {
          console.error(sbUserError);
          return false;
        }

        // In our own table
        const { error: userError } = await supabase
          .from("users")
          .update({ onboarded: true })
          .match({ id: user!.id });
        if (userError) {
          console.error(userError);
          return false;
        }

        toggleSuccess();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }

  return (
    <Section className="relative">
      <BlockingPane
        icon={<MaterialIcon icon="done" size={48} />}
        open={success}
      >
        {t("loggingIn.createPassword.success")}
      </BlockingPane>
      <Header>{t("loggingIn.createPassword.title")}</Header>
      <p>{t("loggingIn.createPassword.desc")}</p>
      <Columns columns={6}>
        <div className="col-span-4 flex flex-col gap-4 md:col-start-2">
          <TextField
            appearance="outlined"
            label={t("loggingIn.createPassword.form.newPwd")}
            error={form.password.length > 0 && form.password.length < 8}
            value={form.password}
            onChange={(value) =>
              setForm({ ...form, password: value as string })
            }
            inputAttr={{ type: "password" }}
          />
          <TextField
            appearance="outlined"
            label={t("loggingIn.createPassword.form.confirmNewPwd")}
            error={
              form.confirmPassword.length > 0 &&
              form.confirmPassword !== form.password
            }
            value={form.confirmPassword}
            onChange={(value) =>
              setForm({ ...form, confirmPassword: value as string })
            }
            inputAttr={{ type: "password" }}
          />
        </div>
      </Columns>
      <Actions>
        <Button
          appearance="tonal"
          loading={loading || undefined}
          onClick={handleSubmit}
        >
          {t("loggingIn.createPassword.action.set")}
        </Button>
      </Actions>
    </Section>
  );
};

const LoggingInPage: CustomPage<{ user: User }> = ({ user }) => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

  // Routing
  const router = useRouter();

  // Supabase
  const supabase = useSupabaseClient();

  // Loading
  const [loading, toggleLoading] = useToggle();

  return (
    <>
      <Head>
        <title>{createTitleStr(t("loggingIn.title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("loggingIn.title")}
        icon={<MaterialIcon icon="password" />}
        parentURL="/account/welcome/your-subjects"
      />
      <ContentLayout>
        <LastPageCard />
        <Columns columns={2} className="!gap-y-8">
          <CheckEmailSection user={user} />
          <CreatePasswordSection />
        </Columns>
        <Actions className="mx-4 sm:mx-0">
          <Button
            appearance="filled"
            loading={loading || undefined}
            onClick={() =>
              withLoading(async () => {
                // Verify that the user is onboarded before continuing
                const { data, error } = await supabase
                  .from("users")
                  .select("onboarded")
                  .match({ id: user!.id })
                  .limit(1)
                  .single();

                if (error) return false;
                if (!data!.onboarded) return false;

                // Redirect
                if (user.role == "teacher") router.push("/teach");
                else router.push("/learn");
                return true;
              }, toggleLoading)
            }
          >
            {t("loggingIn.action.done")}
          </Button>
        </Actions>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session!.user;

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
      ])),
      user,
    },
  };
};

LoggingInPage.navType = "hidden";

export default LoggingInPage;
