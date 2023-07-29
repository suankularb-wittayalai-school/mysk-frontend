// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "next/head";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import PersonActions from "@/components/lookup/person/PersonActions";
import PersonDetailsContent from "@/components/lookup/person/PersonDetailsContent";

// Backend
import { getStudent } from "@/utils/backend/person/student";

// Helpers
import { getLocaleName } from "@/utils/helpers/string";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";

const StudentDetailsPage: CustomPage<{ student: Student }> = ({ student }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{createTitleStr(getLocaleName(locale, student.name), t)}</title>
      </Head>
      <MySKPageHeader
        title={getLocaleName(locale, student.name)}
        parentURL="/class/student"
        className="!overflow-visible"
      >
        <PersonActions person={student} suggestionsType="share-only" />
        <DynamicAvatar
          profile={student.profile}
          className="relative z-[80] -mb-12 -mt-6 !h-20 !w-20 self-end"
        />
      </MySKPageHeader>
      <PersonDetailsContent person={student} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
  res,
}) => {
  const studentID = Number(params?.studentID);

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: student, error } = await getStudent(supabase, studentID);
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      student,
    },
  };
};

export default StudentDetailsPage;
