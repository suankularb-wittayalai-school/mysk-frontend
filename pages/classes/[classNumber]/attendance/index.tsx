// Imports
import getISODateString from "@/utils/helpers/getISODateString";
import lastWeekday from "@/utils/helpers/lastWeekday";
import { CustomPage } from "@/utils/types/common";
import { GetServerSideProps } from "next";

/**
 * A redirect page to the current date’s Attendance page.
 */
const AttendancePage: CustomPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => ({
  redirect: {
    destination: [
      locale !== "th" ? "/" + locale : "",
      "classes",
      params!.classNumber,
      "attendance/date",
      getISODateString(lastWeekday(new Date())),
    ].join("/"),
    permanent: false,
  },
});

export default AttendancePage;
