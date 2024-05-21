import SingleSubjectDetails from "@/components/home/glance/SingleSubjectDetails";
import ScheduleContext from "@/contexts/ScheduleContext";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { PeriodContentItem } from "@/utils/types/schedule";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

/**
 * A Dialog displaying all details of a Subject Period.
 *
 * @param open Whether the Dialog is open and shown.
 * @param period The Period Content Item to display.
 * @param onClose Triggers when the Dialog is closed.
 * @param onDelete Should delete the Period.
 */
const SubjectPeriodDialog: StylableFC<{
  open: boolean;
  period: PeriodContentItem;
  onClose: () => void;
  onDelete?: () => void;
}> = ({ open, period, onClose, onDelete, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule/periodDialog");

  const { editable } = useContext(ScheduleContext);

  return (
    <Dialog
      open={open}
      width={360}
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
      <DialogHeader
        title={getLocaleString(period.subject.name, locale)}
        desc={
          <Text type="title-medium" className="-mt-3 block">
            {getLocaleString(period.subject.code, locale)}
          </Text>
        }
      />
      <DialogContent className="px-4">
        <SingleSubjectDetails period={period} />
      </DialogContent>
      <Actions className={editable ? "!justify-between" : undefined}>
        {editable && (
          <Button
            appearance="text"
            icon={<MaterialIcon icon="delete" />}
            tooltip={t("action.delete")}
            dangerous
            onClick={onDelete}
            className="!ml-1"
          />
        )}
        <Button appearance="text" onClick={onClose}>
          {t("action.close")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default SubjectPeriodDialog;
