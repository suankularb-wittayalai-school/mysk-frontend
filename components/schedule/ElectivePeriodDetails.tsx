import ElectiveGridItem from "@/components/home/glance/ElectiveGridItem";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Student, UserRole } from "@/utils/types/person";
import { SchedulePeriod } from "@/utils/types/schedule";
import { FullscreenDialog } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Full-screen Dialog displaying all options in an Elective Period.
 *
 * @param open Whether the Full-screen Dialog is open and shown.
 * @param period The Schedule Period to display.
 * @param onClose Triggers when the Full-screen Dialog is closed.
 */
const ElectivePeriodDetails: StylableFC<{
  open?: boolean;
  period: SchedulePeriod;
  onClose: () => void;
}> = ({ open, period, onClose }) => {
  const { t } = useTranslation("schedule", {
    keyPrefix: "dialog.electivePeriodDetails",
  });

  const mysk = useMySKClient();

  const chosenElective =
    (mysk.person?.role === UserRole.student &&
      // Find the chosen Elective in the Schedule Period.
      period.content.find(
        (subject) =>
          (mysk.person as Student).chosen_elective?.code.th ===
          subject.subject.code.th,
      )) ||
    null;
  const content = period.content.filter(
    (subject) => chosenElective?.subject.code.th !== subject.subject.code.th,
  );

  return (
    <FullscreenDialog
      open={open}
      title={t("title")}
      onClose={onClose}
      className={cn(
        `[&>:last-child]:max-h-96`,
        // Workaround: Full-screen Dialog currently can’t appear within another
        // Full-screen Dialog. The component was made back when <dialog> wasn’t
        // really a thing yet.
        // Ideally we’d show the nested Full-screen Dialogs but alas.
        `[&_.skc-fullscreen-dialog]:sm:!hidden [&_.skc-scrim]:sm:!hidden`,
      )}
    >
      <ul className="space-y-2 sm:!-m-3">
        {chosenElective && (
          <ElectiveGridItem subject={chosenElective} enrolled />
        )}
        {content.map((subject) => (
          <ElectiveGridItem key={subject.id} subject={subject} />
        ))}
      </ul>
    </FullscreenDialog>
  );
};

export default ElectivePeriodDetails;
