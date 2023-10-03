// Imports
import DynamicAvatar from "@/components/common/DynamicAvatar";
import PageHeader from "@/components/common/PageHeader";
import PersonActions from "@/components/lookup/person/PersonActions";
import PersonDetailsContent from "@/components/lookup/person/PersonDetailsContent";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const StudentDetailsPage: CustomPage<{ student: Student }> = ({ student }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {t("tabName", { tabName: getLocaleName(locale, student) })}
        </title>
      </Head>
      <PageHeader parentURL="/class/student">
        {getLocaleName(locale, student)}
      </PageHeader>
      <PersonActions person={student} suggestionsType="share-only" />
      <DynamicAvatar
        profile={student.profile}
        className="relative z-[80] -mb-12 -mt-6 !h-20 !w-20 self-end"
      />
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
  const studentID = params?.studentID;

  if (!studentID) return { notFound: true };

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: student, error } = await getStudentByID(
    supabase,
    studentID as string,
  );
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
