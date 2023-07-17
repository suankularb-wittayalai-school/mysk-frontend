// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import PrintStudentList from "@/components/class/PrintStudentList";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import {
  getClassFromUser,
  getClassOverview,
  getClassStudentList,
} from "@/utils/backend/classroom/classroom";
import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { ClassOverview, ClassWNumber } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Role, Student } from "@/utils/types/person";

const StudentsListPrintPage: CustomPage<{
  classItem: ClassWNumber;
  classOverview: ClassOverview;
  studentList: Student[];
  userRole: Role;
}> = ({ classItem, classOverview, studentList, userRole }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("student.print.title"), t)}</title>
      </Head>
      <PrintStudentList
        {...{ classItem, classOverview, studentList, userRole }}
      />
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

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);

  const userRole = metadata!.role;

  let classItem: ClassWNumber;
  if (userRole === "student") {
    const { data } = await getClassFromUser(supabase, session!.user);
    classItem = data!;
  } else if (userRole === "teacher") {
    const { data } = await getClassAdvisorAt(supabase, metadata!.teacher!);
    classItem = data!;
  }

  const { data: classOverview } = await getClassOverview(
    supabase,
    classItem!.number
  );

  const { data: studentList } = await getClassStudentList(
    supabase,
    classItem!.id
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classItem: classItem!,
      classOverview,
      studentList,
      userRole,
    },
  };
};

export default StudentsListPrintPage;
