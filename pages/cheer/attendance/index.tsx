// Imports
import getISODateString from "@/utils/helpers/getISODateString";
import lastWeekday from "@/utils/helpers/lastWeekday";
import { CustomPage } from "@/utils/types/common";
import { GetServerSideProps } from "next";

/**
 * A redirect page to the current date’s Cheer Attendance page.
 */
const CheerAttendancePage: CustomPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}) => ({
  redirect: {
    destination: [
      locale !== "th" ? "/" + locale : "",
      "cheer/attendance",
      getISODateString(lastWeekday(new Date())),
    ].join("/"),
    permanent: false,
  },
});

export default CheerAttendancePage;
