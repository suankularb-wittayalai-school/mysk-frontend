// Imports
import BlockingPane from "@/components/common/BlockingPane";
import PageHeader from "@/components/common/PageHeader";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import logError from "@/utils/helpers/logError";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import type { CustomPage, LangCode } from "@/utils/types/common";
import { User } from "@/utils/types/person";
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
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

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
          logError("handleSubmit of CheckEmailSection (auth)", error);
          return false;
        }

        const { error: publicError } = await supabase
          .from("users")
          .update({ email: [email, "sk.ac.th"].join("") })
          .eq("id", user.id);
        if (publicError) {
          logError("handleSubmit of CheckEmailSection (public)", publicError);
          return false;
        }

        toggleSuccess();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
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
                : (value as string),
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

const LoggingInPage: CustomPage<{ user: User }> = ({ user }) => {
  // Translation
  const { t } = useTranslation("welcome");
  const { t: tx } = useTranslation("common");

  // Routing
  const router = useRouter();

  // Supabase
  const supabase = useSupabaseClient();

  // Loading
  const [loading, toggleLoading] = useToggle();

  useEffect(() => {
    // Flag the user as onboarded
    withLoading(
      async () => {
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

        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, []);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("loggingIn.title") })}</title>
      </Head>
      <PageHeader parentURL="/account/welcome">
        {t("loggingIn.title")}
      </PageHeader>
      <ContentLayout>
        <LastPageCard />
        <Columns columns={2} className="!gap-y-8">
          <CheckEmailSection user={user} />
          {/* <CreatePasswordSection /> */}
        </Columns>
        <Actions className="mx-4 sm:mx-0">
          <Button
            appearance="filled"
            loading={loading || undefined}
            onClick={() =>
              withLoading(async () => {
                const { error: userError } = await supabase
                  .from("users")
                  .update({ onboarded: true })
                  .match({ id: user!.id });
                if (userError) {
                  logError("Done submit (onboarding user)", userError);
                  return false;
                }

                // Verify that the user is onboarded before continuing
                const { data, error } = await supabase
                  .from("users")
                  .select("onboarded")
                  .match({ id: user!.id })
                  .order("id")
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
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const data = await getServerSession(req, res, authOptions);

  if (!data) {
    return { notFound: true };
  }

  const { data: user, error } = await getUserByEmail(
    supabase,
    data.user!.email as string,
  );

  if (error) {
    return { notFound: true };
  }

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
