// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import PrintStudentList from "@/components/class/PrintStudentList";

// Backend
import getClassroomOverview from "@/utils/backend/classroom/getClassroomOverview";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole, Student } from "@/utils/types/person";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";

const StudentsListPrintPage: CustomPage<{
  classItem: Pick<Classroom, "id" | "number">;
  classroomOverview: Pick<
  Classroom,
  "id" | "number" | "class_advisors" | "contacts" | "subjects"
>;
  studentList: Student[];
  userRole: UserRole;
}> = ({ classItem, classroomOverview, studentList, userRole }) => {
  const { t } = useTranslation(["class", "common"]);
  // console.log(classOverview)

  return (
    <>
      <Head>
        <title>{createTitleStr(t("student.print.title"), t)}</title>
      </Head>
      <PrintStudentList
        {...{ classItem, classroomOverview, studentList, userRole }}
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

  const { data: user, error } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  );

  const userRole = user!.role;

  let classroom: Pick<Classroom, "id" | "number"> | null = null;

  switch (userRole) {
    case "student":
      classroom = user?.classroom!;
      break;
    case "teacher":
      classroom = user?.class_advisor_at!;
      break;
  }

  if (!classroom) return { notFound: true };

  const { data: classroomOverview } = await getClassroomOverview(
    supabase,
    classroom!.id,
  );

  const { data: compactStudentList } = await getStudentsOfClass(
    supabase,
    classroom!.id,
  );

  const { data: studentList } = await getStudentsByIDs(
    supabase,
    compactStudentList!.map((student) => student.id),
    { detailed: true}
  );

  // console.log({ classroomOverview })

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classItem: classroom!,
      classroomOverview,
      studentList: studentList!.sort((a, b) => a.class_no - b.class_no),
      userRole,
    },
  };
};

export default StudentsListPrintPage;
