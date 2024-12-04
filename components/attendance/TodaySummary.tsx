import HomeroomContentEditor from "@/components/attendance/HomeroomContentEditor";
import cn from "@/utils/helpers/cn";
import { HomeroomContent, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  DURATION,
  EASING,
  MaterialIcon,
  Text,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";

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
  const { t } = useTranslation("attendance", { keyPrefix: "day" });

  const mysk = useMySKClient();

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

  return (
    <motion.div
      layout
      transition={transition(DURATION.medium4, EASING.standard)}
      style={{ ...style, borderRadius: 20 }}
      className={cn(
        `overflow-hidden rounded-lg border-1 border-outline-variant bg-surface-container-high`,
        className,
      )}
    >
      {/* Quick summary */}
      <Text
        type="headline-small"
        element={(props) => (
          <motion.h2
            layout="position"
            transition={transition(DURATION.medium4, EASING.standard)}
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
          transition={transition(DURATION.medium4, EASING.standard)}
          style={{ borderRadius: 12 }}
          className="m-2 overflow-hidden rounded-md bg-surface px-3 pb-3 pt-2"
        >
          <motion.div
            key={homeroomView}
            layout="position"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(DURATION.medium4, EASING.standard)}
            className="grid gap-2"
          >
            <Text type="title-medium">{t("homeroom.title")}</Text>
            {
              {
                // If there is no homeroom content and the user is not a
                // student, show a button to add content.
                empty: (
                  <>
                    {mysk.user?.role === "student" && !mysk.user?.is_admin ? (
                    // mysk.user?.role === "student" && mysk.user?.is_admin ? (
                      <Text
                        type="body-medium"
                        className="text-on-surface-variant"
                      >
                        {t("homeroom.noContent")}
                      </Text>
                    ) : (
                      <Button
                        appearance="filled"
                        icon={<MaterialIcon icon="add" />}
                        onClick={() => setHomeroomView(HomeroomView.edit)}
                        className="!justify-self-start"
                      >
                        {t("homeroom.action.add")}
                      </Button>
                    )}
                  </>
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
                        className={cn(
                          `[&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6`,
                        )}
                      >
                        {homeroomContent.homeroom_content}
                      </Markdown>
                    </Text>
                    {(mysk.user?.role === "teacher" || mysk.user?.is_admin) && (
                      <Button
                        appearance="text"
                        onClick={() => setHomeroomView(HomeroomView.edit)}
                        className="!-mt-1 !justify-self-end"
                      >
                        {t("homeroom.action.edit")}
                      </Button>
                    )}
                  </>
                ),
                // If the user is editing the homeroom content, show the editor.
                edit: (
                  <HomeroomContentEditor
                    key="edit"
                    homeroomContent={homeroomContent}
                    classroomID={classroomID}
                    onViewChange={setHomeroomView}
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
