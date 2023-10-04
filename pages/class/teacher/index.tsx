// Imports
import ClassTeachers from "@/components/class/ClassTeachers";
import PageHeader from "@/components/common/PageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getTeachersOfClass from "@/utils/backend/classroom/getTeachersOfClass";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { SubjectGroupTeachers } from "@/utils/types/subject";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const ClassTeachersPage: CustomPage<{
  classItem: Pick<Classroom, "id" | "number">;
  teacherList: SubjectGroupTeachers[];
  userRole: UserRole;
}> = ({ classItem, teacherList, userRole }) => {
  const { t } = useTranslation("class");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {tx("tabName", { tabName: t(`teacher.title.${userRole}`) })}
        </title>
      </Head>
      <PageHeader parentURL="/class">
        {t(`teacher.title.${userRole}`)}
      </PageHeader>
      <ClassTabs number={classItem.number} type="class" />
      <ClassTeachers {...{ teacherList }} />
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
  );

  const userRole = user!.role;

  let classItem: Pick<Classroom, "id" | "number"> =
    user!.role === "student" ? user!.classroom! : user!.class_advisor_at!;

  const { data: allTeacherList } = await getTeachersOfClass(
    supabase,
    classItem!.id,
  );

  // group by subject group
  const teacherList: SubjectGroupTeachers[] = [];
  for (const teacher of allTeacherList!) {
    const subjectGroup = teacher.subject_group;
    const subjectGroupIndex = teacherList.findIndex(
      (t) => t.subject_group.id === subjectGroup.id,
    );

    if (subjectGroupIndex === -1) {
      teacherList.push({
        subject_group: subjectGroup,
        teachers: [teacher],
      });
    } else {
      teacherList[subjectGroupIndex].teachers.push(teacher);
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classItem: classItem!,
      teacherList,
      userRole,
    },
  };
};

export default ClassTeachersPage;
