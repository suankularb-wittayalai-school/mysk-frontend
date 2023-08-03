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
import { Teacher } from "@/utils/types/person";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";

const TeacherDetailsPage: CustomPage<{ teacher: Teacher }> = ({ teacher }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{createTitleStr(getLocaleName(locale, teacher), t)}</title>
      </Head>
      <PageHeader
        title={getLocaleName(locale, teacher)}
        parentURL="/lookup/person"
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
  const teacherID = params?.teacherID as string;

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: teacher, error } = await getTeacherByID(supabase, teacherID);
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