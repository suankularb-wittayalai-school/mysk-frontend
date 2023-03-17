// External libraries
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// SK Components
import { ContentLayout, Header, Section } from "@suankularb-components/react";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import { getSchedule } from "@/utils/backend/schedule/schedule";
import { getTeachingSubjects } from "@/utils/backend/subject/subject";

// Helpers
import { getLocalePath } from "@/utils/helpers/i18n";
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

// Page
const TeachPage: CustomPage = () => {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <ContentLayout>
        <Section>
          <Header>TODO</Header>
          <p className="skc-body-medium">TODO</p>
        </Section>
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

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id
  );
  if (metadataError) console.error(metadataError);

  if (!metadata?.onboarded)
    return {
      redirect: {
        destination: getLocalePath("/welcome", locale as LangCode),
        permanent: false,
      },
    };

  const { data: schedule } = await getSchedule(
    supabase,
    "teacher",
    metadata.teacher!
  );

  const { data: subjects } = await getTeachingSubjects(
    supabase,
    metadata.teacher!
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "teach",
        "schedule",
      ])),
      schedule,
      subjects,
    },
  };
};

TeachPage.pageHeader = {
  title: { key: "title", ns: "teach" },
  parentURL: "/account/logout",
};

TeachPage.pageRole = "teacher";

export default TeachPage;
