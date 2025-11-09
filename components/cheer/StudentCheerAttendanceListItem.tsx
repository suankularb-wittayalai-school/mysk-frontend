import { FC } from "react";
import {
  DURATION,
  EASING,
  ListItem,
  ListItemContent,
  TextField,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import {
  CheerAttendanceEvent,
  CheerAttendanceRecord,
  CheerAttendanceType,
} from "@/utils/types/cheer";
import CheerAttendanceSelector from "@/components/cheer/CheerAttendanceSelector";
import useTranslation from "next-translate/useTranslation";
import CheerAbsenceTypeSelector from "@/components/cheer/CheerAbsenceTypeSelector";

const StudentCheerAttendanceListItem: FC<{
  attendance: CheerAttendanceRecord;
  event: CheerAttendanceEvent;
}> = ({ attendance, event }) => {
  const { t } = useTranslation("attendance/cheer/list");
  return (
    <motion.li
      key={attendance.id}
      layoutId={attendance.id}
      transition={transition(DURATION.medium2, EASING.standard)}
    >
      <motion.ul layout="position" className={"grid w-full py-1"}>
        <ListItem
          align="center"
          lines={2}
          element="div"
          className="!items-center !overflow-visible"
        >
          <ListItemContent
            title={t("date", {
              date: new Date(attendance.practice_period.date),
            })}
            desc={t("period", {
              start: new Date(
                attendance.practice_period.date +
                  "T" +
                  attendance.practice_period.start_time,
              ),
              end: new Date(
                attendance.practice_period.date +
                  "T" +
                  attendance.practice_period.end_time,
              ),
            })}
            className="w-0 [&>span]:!truncate"
          />
          <CheerAttendanceSelector
            attendance={attendance}
            shownEvent={event}
            editable={false}
            onChange={() => {}}
            className="-mr-4 -space-x-1"
          />
        </ListItem>
        {event == "start" &&
          (attendance.presence == CheerAttendanceType.onLeaveNoRemedial ||
            attendance.presence == CheerAttendanceType.onLeaveWithRemedial ||
            attendance.presence == CheerAttendanceType.missing) && (
            <CheerAbsenceTypeSelector
              attendance={attendance}
              editable={false}
              onChange={() => {}}
              className="mb-2 *:px-4"
            />
          )}
        {event == "start" &&
          (attendance.presence == CheerAttendanceType.onLeaveNoRemedial ||
            attendance.presence == CheerAttendanceType.onLeaveWithRemedial) && (
            <div className="mt-1 px-4 sm:pb-2">
              <TextField<string>
                appearance="outlined"
                label={t("enterReason")}
                value={attendance.absence_reason || ""}
              />
            </div>
          )}
      </motion.ul>
    </motion.li>
  );
};

export default StudentCheerAttendanceListItem;
