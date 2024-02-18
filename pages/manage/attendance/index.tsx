// Imports
import getISODateString from "@/utils/helpers/getISODateString";
import getLocalePath from "@/utils/helpers/getLocalePath";
import lastWeekday from "@/utils/helpers/lastWeekday";
import { CustomPage, LangCode } from "@/utils/types/common";
import { GetServerSideProps } from "next";

/**
 * A redirect page to the current date’s Attendance Overview page.
 */
const AttendanceOverviewPage: CustomPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  redirect: {
    destination: getLocalePath(
      "manage/attendance/" + getISODateString(lastWeekday(new Date())),
      locale as LangCode,
    ),
    permanent: false,
  },
});

export default AttendanceOverviewPage;
