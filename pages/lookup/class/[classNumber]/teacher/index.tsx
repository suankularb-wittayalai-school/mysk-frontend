// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassTeachers from "@/components/class/ClassTeachers";
import PageHeader from "@/components/common/PageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Backend

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { SubjectGroupTeachers } from "@/utils/types/subject";
import { CustomPage, LangCode } from "@/utils/types/common";
import { getCurrentAcademicYear } from "@/utils/helpers/date";
import getTeachersOfClass from "@/utils/backend/classroom/getTeachersOfClass";

const ClassTeachersPage: CustomPage<{
  classNumber: number;
  teacherList: SubjectGroupTeachers[];
}> = ({ classNumber, teacherList }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(
            t("teacher.title.lookup", { number: classNumber }),
            t
          )}
        </title>
      </Head>
      <PageHeader
        title={t("teacher.title.lookup", { number: classNumber })}
        parentURL={`/lookup/class/${classNumber}`}
      >
        <ClassTabs number={classNumber} type="lookup" />
      </PageHeader>
      <ClassTeachers {...{ teacherList, classNumber }} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const {data, error} = await supabase.from("classrooms").select("id").eq("number", classNumber).eq("year", getCurrentAcademicYear()).single();

  if (error) return { notFound: true };

  const classID = data.id;

  
  const { data: allTeacherList } = await getTeachersOfClass(supabase, classID);

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
      classNumber,
      teacherList,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: classNumbers, error } = await supabase.from("classrooms").select("number").eq("year", getCurrentAcademicYear());
  
  if (error) return { paths: [], fallback: "blocking" };

  return {
    paths: classNumbers!.map((classroom) => ({
      params: { classNumber: classroom.number.toString() },
    })),
    fallback: "blocking",
  };
};

export default ClassTeachersPage;
