// External libraries
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Backend
import { getUserMetadata } from "@/utils/backend/account";

// Helpers
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useToggle } from "@/utils/hooks/toggle";

// Types
import type { CustomPage, LangCode } from "@/utils/types/common";
import { Role } from "@/utils/types/person";

const YourSubjectsPage: CustomPage<{ user: User, userRole: Role }> = ({ user, userRole }) => {
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
        <p>Bet.</p>
        <Actions>
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

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    user.id
  );
  if (metadataError) console.error(metadataError);
  const userRole = metadata!.role;

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
      ])),
      user,
      userRole,
    },
  };
};

YourSubjectsPage.pageHeader = {
  title: { key: "loggingIn.title", ns: "welcome" },
  icon: <MaterialIcon icon="waving_hand" />,
  parentURL: "/account/welcome/covid-19-safety",
};

export default YourSubjectsPage;
