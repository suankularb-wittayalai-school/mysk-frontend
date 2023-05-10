// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

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
import { getTeacher } from "@/utils/backend/person/teacher";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";

const TeacherDetailsPage: CustomPage<{ teacher: Teacher }> = ({ teacher }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{createTitleStr(nameJoiner(locale, teacher.name), t)}</title>
      </Head>
      <MySKPageHeader
        title={nameJoiner(locale, teacher.name)}
        parentURL="/lookup/person"
        className="!overflow-visible"
      >
        <PersonActions person={teacher} suggestionsType="full" />
        <DynamicAvatar
          profile={teacher.profile}
          className="relative z-[80] -mb-12 -mt-6 !h-20 !w-20 self-end"
        />
      </MySKPageHeader>
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
  const teacherID = Number(params?.teacherID);

  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: teacher, error } = await getTeacher(supabase, teacherID);
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      teacher,
    },
  };
};

export default TeacherDetailsPage;
