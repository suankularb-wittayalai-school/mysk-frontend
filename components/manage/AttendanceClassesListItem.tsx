// Imports
import cn from "@/utils/helpers/cn";
import {
  ClassroomAttendance,
  ManagementAttendanceSummary,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { ListItem, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { sum } from "radash";
import Markdown from "react-markdown";

/**
 * An item in the Classes Breakdown of the Date Attendance Overview page.
 *
 * @param attendance Attendance summary of a Classroom.
 */
const AttendanceClassesListItem: StylableFC<{
  attendance: ClassroomAttendance;
}> = ({ attendance, style, className }) => {
  const { t: tx } = useTranslation("common");

  const total = sum(Object.values(attendance.summary));
  const percentages = Object.fromEntries(
    Object.entries(attendance.summary).map(([key, value]) => [
      key,
      (value / total) * 100,
    ]),
  ) as ManagementAttendanceSummary;

  return (
    <ListItem
      align="top"
      lines={3}
      style={style}
      className={cn(
        `!grid break-inside-avoid grid-cols-10 !gap-x-6`,
        className,
      )}
    >
      <Text type="body-large" className="col-span-3">
        {tx("class", attendance.classroom)}
      </Text>
      <div className="col-span-3 grid gap-2">
        <Text type="body-large" className="grid min-w-[12rem] grid-cols-3">
          <span>{attendance.summary.presence}</span>
          <span>{attendance.summary.late}</span>
          <span>{attendance.summary.absence}</span>
        </Text>
        <div className="flex h-1 flex-row overflow-hidden rounded-full bg-surface-variant">
          <div
            className="bg-primary"
            style={{ width: `${percentages.presence}%` }}
          />
          <div
            className="bg-secondary ring-4 ring-surface-variant"
            style={{ width: `${percentages.late}%` }}
          />
        </div>
      </div>
      <Text type="body-medium" className="col-span-4" element="div">
        <Markdown
          className={cn(`[&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc
            [&_ul]:pl-6`)}
        >
          {attendance.homeroom_content}
        </Markdown>
      </Text>
    </ListItem>
  );
};

export default AttendanceClassesListItem;
