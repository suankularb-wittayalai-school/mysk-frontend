import ElectiveGridItem from "@/components/home/glance/ElectiveGridItem";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Student, UserRole } from "@/utils/types/person";
import { SchedulePeriod } from "@/utils/types/schedule";
import {
  Button,
  Dialog,
  DialogContent,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Dialog displaying all options in an Elective Period.
 *
 * @param open Whether the Dialog is open and shown.
 * @param period The Schedule Period to display.
 * @param onClose Triggers when the Dialog is closed.
 */
const ElectivePeriodDialog: StylableFC<{
  open?: boolean;
  period: SchedulePeriod;
  onClose: () => void;
}> = ({ open, period, onClose, style, className }) => {
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
    <Dialog
      open={open}
      // To keep the same width as the Single Period Details in Subject Period
      // Details Dialog.
      width={376}
      onClose={onClose}
      style={style}
      className={cn(
        // Workaround: Full-screen Dialog currently can’t appear within another
        // Dialog. The component was made back when <dialog> wasn’t really a
        // thing yet.
        // Ideally we’d show the nested Full-screen Dialogs but alas.
        `[&_.skc-fullscreen-dialog]:!hidden [&_.skc-scrim]:!hidden`,
        className,
      )}
    >
      <div
        className={cn(`sticky inset-auto bottom-auto flex flex-row items-center
          gap-2 p-3`)}
      >
        <Button
          appearance="text"
          icon={<MaterialIcon icon="close" />}
          tooltip={t("action.close")}
          onClick={onClose}
          className="!text-on-surface-variant state-layer:!bg-on-surface-variant"
        />
        <Text type="title-large">{t("title")}</Text>
      </div>
      <DialogContent
        height={400}
        element="ul"
        className="space-y-2 !border-b-0 p-4"
      >
        {chosenElective && (
          <ElectiveGridItem subject={chosenElective} enrolled />
        )}
        {content.map((subject) => (
          <ElectiveGridItem key={subject.id} subject={subject} />
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ElectivePeriodDialog;
