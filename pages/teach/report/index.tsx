import { CustomPage } from "@/utils/types/common";
import { Teacher, UserRole } from "@/utils/types/person";
import { LangCode } from "@/utils/types/common";
import PageHeader from "@/components/common/PageHeader";
import ReportDetailsCard from "@/components/report/ReportDetailsCard";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { BackendReturn } from "@/utils/types/backend";
import getLocalePath from "@/utils/helpers/getLocalePath";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SplitLayout } from "@suankularb-components/react";
import { MySKClient } from "@/utils/types/fetch";
import { SupabaseClient } from "@supabase/supabase-js";

const ReportPage: CustomPage<{
  teacher: Teacher;
  mysk: MySKClient;
}> = ({ teacher }) => {
  console.log(teacher, "teacher");
  return (
    <>
      <PageHeader parentURL="/teach">{"Teaching Report"}</PageHeader>
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <LookupListSide length={5}>
          <div>list</div>
        </LookupListSide>
        <LookupDetailsSide selectedID={"1"} length={1}>
          <ReportDetailsCard teacher={teacher} />
        </LookupDetailsSide>
      </SplitLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: teacher, error } = (await getLoggedInPerson(supabase, mysk, {
    includeContacts: true,
    detailed: true,
  })) as BackendReturn<Teacher>;
  if (error) return { notFound: true };

  if (teacher.role !== UserRole.teacher)
    return {
      redirect: {
        destination: getLocalePath("/learn", locale as LangCode),
        permanent: false,
      },
    };
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["report"])),
      teacher,
    },
  };
};

export default ReportPage;
