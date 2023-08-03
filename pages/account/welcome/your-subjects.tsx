// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

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
import PageHeader from "@/components/common/PageHeader";
import TeachingSubjectCard from "@/components/subject/TeachingSubjectCard";

// Backend
import getTeachingSubjects from "@/utils/backend/subject/getTeachingSubjects";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SubjectClassrooms } from "@/utils/types/subject";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const YourSubjectsPage: CustomPage<{
  subjects: SubjectClassrooms[];
}> = ({ subjects }) => {
  const { t } = useTranslation(["welcome", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("yourSubjects.title"), t)}</title>
      </Head>
      <PageHeader
        title={t("yourSubjects.title")}
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
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  );

  const { data: subjects } = await getTeachingSubjects(supabase, user!.id);

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
