// External libraries
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Backend
import { getUserMetadata } from "@/utils/backend/account/getUserByEmail";
import {
  getAllClassNumbers,
  getClassOverview,
  getClassStudentList,
  getClassWNumber,
} from "@/utils/backend/classroom/classroom";

// Internal components
import PrintStudentList from "@/components/class/PrintStudentList";

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
}> = ({ classItem, classOverview, studentList }) => {
  const { t } = useTranslation(["class", "common"]);

  const user = useUser();
  const supabase = useSupabaseClient();
  const [userRole, setUserRole] = useState<Role>("student");
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: metadata } = await getUserMetadata(supabase, user!.id);
      setUserRole(metadata?.role || "student");
    })();
  }, [user]);

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

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const { data: classItem, error: classError } = await getClassWNumber(
    supabase,
    classNumber
  );
  if (classError) return { notFound: true };

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
      classItem,
      classOverview,
      studentList,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllClassNumbers(supabase)).map((number) => ({
      params: { classNumber: number.toString() },
    })),
    fallback: "blocking",
  };
};

export default StudentsListPrintPage;
