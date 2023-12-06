// Imports
import AttendanceStatusSelector from "@/components/attendance/AttendanceStatusSelector";
import DynamicAvatar from "@/components/common/DynamicAvatar";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import {
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  ListItem,
  ListItemContent,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { sift } from "radash";

/**
 * A List Item for the Attendance page.
 *
 * @param attendance The Attendance of a Student at assembly and homeroom.
 * @param editable Whether the Attendance is editable.
 * @param onAttendanceChange Callback when the Attendance is changed.
 */
const AttendanceListItem: StylableFC<{
  attendance: StudentAttendance;
  shownEvent: AttendanceEvent;
  editable?: boolean;
  onAttendanceChange: (attendance: StudentAttendance) => void;
}> = ({ attendance, shownEvent, editable, onAttendanceChange }) => {
  const locale = useLocale();

  const { duration, easing } = useAnimationConfig();

  // Ideally we would just have a motion.li > ListItem sequence, but `element`
  // doesn’t seem to work on List Item, so we have that would result in li > li,
  // which is invalid HTML.

  // ```tsx
  // <motion.li>
  //   <ListItem>
  //     ...
  // ```

  // So we have to use motion.li > motion.ul > ListItem, which results in
  // li > ul > li, which *is* valid HTML, but is horrible for accessibility. But
  // it works for now--until SKCom fixes this.

  // ```tsx
  // <motion.li>
  //   <motion.ul>
  //     <ListItem>
  //       ...
  // ```

  return (
    <motion.li
      layoutId={attendance.student.id}
      transition={transition(duration.medium2, easing.standard)}
    >
      <motion.ul layout="position">
        <ListItem
          key={attendance.student.id}
          align="top"
          lines={2}
          className={cn(`!grid !gap-x-6 !gap-y-0 !pb-3 !pr-3 sm:grid-cols-2
            sm:!gap-y-4 sm:!px-0 sm:!pb-6 md:grid-cols-10 md:!pb-2`)}
        >
          <div className="flex flex-row gap-4 sm:col-span-2 md:col-span-4">
            <DynamicAvatar {...attendance.student} className="my-0.5" />
            <ListItemContent
              title={getLocaleName(locale, attendance.student)}
              desc={sift([
                `No. ${attendance.student.class_no}`,
                (attendance.student.nickname?.th ||
                  attendance.student.nickname?.["en-US"]) &&
                  getLocaleString(attendance.student.nickname, locale),
              ]).join(" • ")}
            />
          </div>
          <AttendanceStatusSelector
            attendance={attendance.assembly}
            editable={editable}
            onAttendanceChange={(assembly) =>
              onAttendanceChange({ ...attendance, assembly })
            }
            className={cn(
              `md:col-span-3`,
              shownEvent !== "assembly" && "hidden sm:flex",
            )}
          />
          <AttendanceStatusSelector
            attendance={attendance.homeroom}
            editable={editable}
            onAttendanceChange={(homeroom) =>
              onAttendanceChange({ ...attendance, homeroom })
            }
            className={cn(
              `md:col-span-3`,
              shownEvent !== "homeroom" && "hidden sm:flex",
            )}
          />
        </ListItem>
      </motion.ul>
    </motion.li>
  );
};

export default AttendanceListItem;
