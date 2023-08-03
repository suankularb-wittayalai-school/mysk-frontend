// Imports
import DynamicAvatar from "@/components/common/DynamicAvatar";
import PageHeader from "@/components/common/PageHeader";
import PersonActions from "@/components/lookup/person/PersonActions";
import PersonDetailsContent from "@/components/lookup/person/PersonDetailsContent";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import { getLocaleName } from "@/utils/helpers/string";
import { createTitleStr } from "@/utils/helpers/title";
import { useLocale } from "@/utils/hooks/i18n";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const PersonDetailsPage: CustomPage<{
  teacher: Teacher;
  classNumber: number;
}> = ({ teacher, classNumber }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{createTitleStr(getLocaleName(locale, teacher), t)}</title>
      </Head>
      <PageHeader
        title={getLocaleName(locale, teacher)}
        parentURL={`/lookup/class/${classNumber}`}
      >
        <PersonActions person={teacher} suggestionsType="full" />
        <DynamicAvatar
          profile={teacher.profile}
          className="relative z-[80] -mb-12 -mt-6 !h-20 !w-20 self-end"
        />
      </PageHeader>
      <PersonDetailsContent person={teacher} />
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

  const teacherID = params?.teacherID;

  if (!teacherID) return { notFound: true };

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: teacher, error } = await getTeacherByID(
    supabase,
    teacherID as string,
  );
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      teacher,
      classNumber,
    },
  };
};

export default PersonDetailsPage;
