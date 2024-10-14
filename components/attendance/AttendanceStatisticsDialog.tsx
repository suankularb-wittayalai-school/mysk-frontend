import getClassrooomsWithoutAttendance from "@/utils/backend/attendance/getClassroomsWithoutAttendance";
import getSchoolAttendanceSummary from "@/utils/backend/attendance/getSchoolAttendanceSummary";
import cn from "@/utils/helpers/cn";
import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  ChipSet,
  Dialog,
  DialogContent,
  DialogHeader,
  InputChip,
  Progress,
  Text,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";

/**
 * A Dialog for showing the Attendance statistics of the selected date,
 * including a list of Classrooms that have no attendance.
 *
 * @param open Whether the dialog is open and shown.
 * @param date The date to show the statistics of.
 * @param onClose Triggers when the Dialog is closed.
 */
const AttendanceStatisticsDialog: StylableFC<{
  open?: boolean;
  date: string | Date;
  onClose: () => void;
}> = ({ open, date, onClose, style, className }) => {
  const { t } = useTranslation("attendance/statisticsDialog");
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();

  const [summary, setSummary] = useState<{
    totals: ManagementAttendanceSummary;
    classroomsWithoutAttendance: Pick<Classroom, "id" | "number">[];
  }>();

  useEffect(() => setSummary(undefined), [date]);
  useEffect(() => {
    if (!open || summary) return;
    (async () => {
      const [{ data: totals }, { data: classroomsWithoutAttendance }] =
        await Promise.all([
          getSchoolAttendanceSummary(supabase, date),
          getClassrooomsWithoutAttendance(supabase, date),
        ]);
      setSummary({
        totals: totals!,
        classroomsWithoutAttendance: classroomsWithoutAttendance!,
      });
    })();
  }, [open]);

  return (
    <Dialog
      open={open}
      width={320}
      onClose={onClose}
      className={className}
      style={style}
    >
      <DialogHeader desc={t("desc")} />

      <DialogContent className="relative min-h-[calc(12rem+2px)]">
        {summary && (
          <motion.div className="grid gap-6 px-6 text-on-surface-variant">
            {/* Totals */}
            <Text type="title-large" element="p" className="grid">
              {Object.entries(summary.totals).map(([key, count]) => (
                <span key={key}>{t(`total.${key}`, { count })}</span>
              ))}
            </Text>

            {/* Classrooms without Attendance */}
            {summary.classroomsWithoutAttendance.length > 0 && (
              <>
                <Text type="body-medium" element="p">
                  {t("missing", {
                    count: summary.classroomsWithoutAttendance.length,
                  })}
                </Text>
                <ChipSet scrollable className="-mx-6 -mt-3 [&>div]:px-6">
                  {summary.classroomsWithoutAttendance.map((classroom) => (
                    <InputChip key={classroom.id}>
                      {tx("class", { number: classroom.number })}
                    </InputChip>
                  ))}
                </ChipSet>
              </>
            )}
          </motion.div>
        )}

        <div
          className={cn(`pointer-events-none absolute inset-0 -top-6 grid
            place-content-center`)}
        >
          <Progress
            appearance="circular"
            alt={t("loading")}
            visible={!summary}
          />
        </div>
      </DialogContent>

      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.close")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AttendanceStatisticsDialog;
