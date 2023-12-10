// Imports
import HomeroomContentEditor from "@/components/attendance/HomeroomContentEditor";
import cn from "@/utils/helpers/cn";
import { HomeroomContent, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  Columns,
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import Balancer from "react-wrap-balancer";

export enum HomeroomView {
  empty = "empty",
  view = "view",
  edit = "edit",
}

/**
 * Today Summary displays a quick summary of Attendance for the Date Attendance
 * page.
 *
 * @param attendances The Attendance data to be summarized.
 * @param homeroomContent An object containing the content of this day’s homeroom.
 * @param classroomID The ID of the Classroom that this summary is for. Used in recording Homeroom Content.
 */
const TodaySummary: StylableFC<{
  attendances: StudentAttendance[];
  homeroomContent: HomeroomContent;
  classroomID: string;
}> = ({ attendances, homeroomContent, classroomID }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "today" });

  // Count the number of students who are marked as late at Assembly.
  // Since being ”late” refers to arrving late to Assembly, we only count those
  // who are marked as late at Assembly.
  const lateCount = attendances.filter(
    (attendance) => attendance.assembly.absence_type === "late",
  ).length;

  // Count the number of students who are absent.
  const absenceCount = attendances.filter((attendance) => {
    const availableAttendance =
      attendance[
        // Use the event that has complete data.
        attendances.every(
          (attendance) => attendance.homeroom.is_present !== null,
        )
          ? "homeroom"
          : "assembly"
      ];
    // Count only those who are absent, not late.
    return (
      availableAttendance.is_present === false &&
      availableAttendance.absence_type !== "late"
    );
  }).length;

  const [homeroomView, setHomeroomView] = useState<HomeroomView>(
    homeroomContent.homeroom_content ? HomeroomView.view : HomeroomView.empty,
  );
  useEffect(
    () =>
      setHomeroomView(
        homeroomContent.homeroom_content
          ? HomeroomView.view
          : HomeroomView.empty,
      ),
    [homeroomContent],
  );

  const { duration, easing } = useAnimationConfig();

  return (
    <Columns columns={2} className="!gap-y-0">
      {/* Quick summary */}
      <div className="flex flex-row gap-2">
        <Text type="headline-small" element="h2" className="grow">
          {t("title", { late: lateCount, absent: absenceCount })}
        </Text>
        <AnimatePresence initial={false}>
          {homeroomView === HomeroomView.view && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={transition(duration.short4, easing.standard)}
            >
              <Button
                appearance="text"
                onClick={() => setHomeroomView(HomeroomView.edit)}
              >
                Edit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div aria-hidden />

      {/* Homeroom Content */}
      <AnimatePresence mode="wait" initial={false}>
        {
          {
            // If there is no homeroom content, show a button to add content.
            empty: (
              <motion.div
                key="empty"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={transition(duration.short4, easing.standard)}
                className="mt-1.5 !justify-self-start"
              >
                <Button
                  appearance="tonal"
                  icon={<MaterialIcon icon="add" />}
                  onClick={() => setHomeroomView(HomeroomView.edit)}
                >
                  {t("homeroom.action.add")}
                </Button>
              </motion.div>
            ),
            // If there is homeroom content, show the content.
            view: (
              <Text
                key="view"
                type="body-medium"
                element="div"
                className="-mt-1"
              >
                <Markdown
                  className={cn(`[&_ol]:list-decimal [&_ol]:pl-6
                    [&_ul]:list-disc [&_ul]:pl-6`)}
                >
                  {homeroomContent.homeroom_content}
                </Markdown>
              </Text>
            ),
            // If the user is editing the homeroom content, show the editor.
            edit: (
              <HomeroomContentEditor
                key="edit"
                homeroomContent={homeroomContent}
                classroomID={classroomID}
                onViewChange={setHomeroomView}
                className="mt-2"
              />
            ),
          }[homeroomView]
        }
      </AnimatePresence>
    </Columns>
  );
};

export default TodaySummary;
