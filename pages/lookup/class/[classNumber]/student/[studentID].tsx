// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "next/head";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";
import PageHeader from "@/components/common/PageHeader";
import PersonActions from "@/components/lookup/person/PersonActions";
import PersonDetailsContent from "@/components/lookup/person/PersonDetailsContent";

// Backend

// Helpers
import { getLocaleName } from "@/utils/helpers/string";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { getCurrentAcademicYear } from "@/utils/helpers/date";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";

const PersonDetailsPage: CustomPage<{
  student: Student;
  classNumber: number;
}> = ({ student, classNumber }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{createTitleStr(getLocaleName(locale, student), t)}</title>
      </Head>
      <PageHeader
        title={getLocaleName(locale, student)}
        parentURL={`/lookup/class/${classNumber}`}
        className="!overflow-visible"
      >
        <PersonActions person={student} suggestionsType="full" />
        <DynamicAvatar
          profile={student.profile}
          className="relative z-[80] -mb-12 -mt-6 !h-20 !w-20 self-end"
        />
      </PageHeader>
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
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  // const {data} = await supabase.from("classrooms").select("id").eq("number", classNumber).eq("year", getCurrentAcademicYear()).single();
  const studentID = params?.studentID;

  if (!studentID) return { notFound: true };

  const { data: student, error } = await getStudentByID(supabase, studentID as string);
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      student,
      classNumber,
    },
  };
};

export default PersonDetailsPage;
