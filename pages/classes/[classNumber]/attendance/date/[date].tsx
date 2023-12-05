// Imports
import ClassAttendanceLayout from "@/components/attendance/ClassAttendanceLayout";
import PageHeader from "@/components/common/PageHeader";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

/**
 * Date Attendance page displays Attendance of a Classroom at specific date.
 */
const DateAttendancePage: CustomPage<{
  date: string;
  classroom: Pick<Classroom, "id" | "number">;
}> = ({ date, classroom }) => {
  const { t } = useTranslation("attendance");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "Attendance" })}</title>
      </Head>
      <PageHeader>Attendance</PageHeader>
      <ClassAttendanceLayout date={date}>
        <p>TODO</p>
      </ClassAttendanceLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
  res,
}) => {
  const { classNumber, date } = params as { [key: string]: string };

  const classroom = { id: "", number: Number(classNumber) };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
      ])),
      date,
      classroom,
    },
  };
};

export default DateAttendancePage;
