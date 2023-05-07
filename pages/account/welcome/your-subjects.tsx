// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import TeachingSubjectCard from "@/components/subject/TeachingSubjectCard";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import { getTeachingSubjects } from "@/utils/backend/subject/roomSubject";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { TeacherSubjectItem } from "@/utils/types/subject";

const YourSubjectsPage: CustomPage<{
  subjects: TeacherSubjectItem[];
}> = ({ subjects }) => {
  const { t } = useTranslation(["welcome", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("yourSubjects.title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("yourSubjects.title")}
        icon={<MaterialIcon icon="book" />}
        parentURL="/account/welcome/your-information"
      />
      <ContentLayout>
        <Section>
          <Columns columns={3}>
            {subjects.map((subject) => (
              <TeachingSubjectCard key={subject.id} subject={subject} />
            ))}
          </Columns>
        </Section>
        <Actions className="mx-4 sm:mx-0 sm:mb-20">
          <Button
            appearance="filled"
            href="/account/welcome/logging-in"
            element={Link}
          >
            {t("common.action.next")}
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

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id
  );
  if (metadataError) console.error(metadataError);

  const { data: subjects } = await getTeachingSubjects(
    supabase,
    metadata!.teacher!
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
        "teach",
      ])),
      subjects,
    },
  };
};

YourSubjectsPage.childURLs = ["/account/welcome/logging-in"];

YourSubjectsPage.navType = "hidden";

export default YourSubjectsPage;
