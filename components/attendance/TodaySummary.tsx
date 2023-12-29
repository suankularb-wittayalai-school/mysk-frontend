// Imports
import HomeroomContentEditor from "@/components/attendance/HomeroomContentEditor";
import cn from "@/utils/helpers/cn";
import { HomeroomContent, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

/**
 * The view of the Homeroom Content.
 */
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
}> = ({ attendances, homeroomContent, classroomID, style, className }) => {
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
    <motion.div
      layout
      transition={transition(duration.medium4, easing.standard)}
      style={{ ...style, borderRadius: 12 }}
      className={cn(
        `overflow-hidden rounded-lg border-1 border-outline-variant
        bg-surface-3`,
        className,
      )}
    >
      {/* Quick summary */}
      <Text
        type="headline-small"
        element={(props) => (
          <motion.h2
            layout="position"
            transition={transition(duration.medium4, easing.standard)}
            {...props}
          />
        )}
        className="h-12 border-b-1 border-surface-variant bg-surface px-4 py-2"
      >
        {t("title", { late: lateCount, absent: absenceCount })}
      </Text>

      {/* Homeroom Content */}
      <AnimatePresence initial={false}>
        <motion.div
          layout
          transition={transition(duration.medium4, easing.standard)}
          style={{ borderRadius: 12 }}
          className="m-2 overflow-hidden rounded-md bg-surface px-3 pb-3 pt-2"
        >
          <motion.div
            key={homeroomView}
            layout="position"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(duration.medium4, easing.standard)}
            className="grid gap-2"
          >
            <Text type="title-medium">{t("homeroom.title")}</Text>
            {
              {
                // If there is no homeroom content, show a button to add content.
                empty: (
                  <Button
                    appearance="filled"
                    icon={<MaterialIcon icon="add" />}
                    onClick={() => setHomeroomView(HomeroomView.edit)}
                    className="!justify-self-start"
                  >
                    {t("homeroom.action.add")}
                  </Button>
                ),
                // If there is homeroom content, show the content.
                view: (
                  <>
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
                    <Button
                      appearance="text"
                      onClick={() => setHomeroomView(HomeroomView.edit)}
                      className="!-mt-1 !justify-self-end"
                    >
                      {t("homeroom.action.edit")}
                    </Button>
                  </>
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
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default TodaySummary;
