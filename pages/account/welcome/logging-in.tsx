// External libraries
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
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

// Helpers
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import type { CustomPage, LangCode } from "@/utils/types/common";
import Link from "next/link";

const LastPageCard: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Card
      appearance="outlined"
      className="mx-4 !flex-row items-center gap-3 py-3 px-4 sm:mx-0"
    >
      <MaterialIcon icon="info" className="text-on-surface-variant" />
      <p>
        You’re almost there! This is the last page: you’ll log in to MySK proper
        after you press “Done.”
      </p>
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
  function handleSubmit() {
    withLoading(
      async () => {
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
        Check both your old and new email, and click the link on both addresses.{" "}
        <Link href="/help/essentials/onboarding" className="link">
          Learn more
        </Link>
      </BlockingPane>
      <Header>Check email</Header>
      <p>
        You’re using “{user.email},” does that seem correct? If not, specify a
        new one, and we’ll send an email to both your old and your new email
        addresses to confirm the change. You must click the link on both
        addresses.
      </p>
      <Columns columns={6}>
        <TextField
          appearance="outlined"
          label="Email"
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
          Send verification email
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
        Password created. You’re all set to start exploring MySK!
      </BlockingPane>
      <Header>Create a password</Header>
      <p>
        For the security of you and the school’s data, create a new password for
        your MySK account. Enter your new password twice to confirm.
      </p>
      <Columns columns={6}>
        <div className="col-span-4 flex flex-col gap-4 md:col-start-2">
          <TextField
            appearance="outlined"
            label="New password"
            error={form.password.length > 0 && form.password.length < 8}
            value={form.password}
            onChange={(value) =>
              setForm({ ...form, password: value as string })
            }
            inputAttr={{ type: "password" }}
          />
          <TextField
            appearance="outlined"
            label="Confirm new password"
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
          Set password
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
        <title>{createTitleStr("Welcome", t)}</title>
      </Head>
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
            Done
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

LoggingInPage.pageHeader = {
  title: { key: "loggingIn.title", ns: "welcome" },
  icon: <MaterialIcon icon="password" />,
  parentURL: "/account/welcome/covid-19-safety",
};

export default LoggingInPage;