import SingleSubjectDetails from "@/components/home/glance/SingleSubjectDetails";
import PeriodDetailsContent from "@/components/schedule/PeriodDetailsContent";
import ScheduleContext from "@/contexts/ScheduleContext";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { PeriodContentItem } from "@/utils/types/schedule";
import {
  Actions,
  Button,
  DURATION,
  Dialog,
  DialogContent,
  DialogHeader,
  EASING,
  MaterialIcon,
  Text,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

/**
 * A Dialog displaying all details of a Subject Period.
 * 
 * @param open Whether the Dialog is open and shown.
 * @param period The Period Content Item to display.
 * @param onClose Triggers when the Dialog is closed.
 * @param onDelete Should delete the Period.
 */
const PeriodDetailsDialog: StylableFC<{
  open: boolean;
  period: PeriodContentItem;
  onClose: () => void;
  onDelete?: () => void;
}> = ({ open, period, onClose, onDelete, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", {
    keyPrefix: "dialog.periodDetails",
  });

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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dialog container (for positioning) */}
          <div
            className={cn(`pointer-events-none fixed inset-0 z-[100] grid
              place-items-center`)}
          >
            {/* Dialog */}
            <motion.div
              role="alertdialog"
              aria-modal
              layoutId={`period-${period.id}`}
              transition={transition(DURATION.medium4, EASING.standard)}
              className={cn(`pointer-events-auto w-80 overflow-hidden
                rounded-xl bg-surface-container-high text-on-surface-variant`)}
            >
              <div
                className={cn(`grid grid-cols-[2.5rem,auto] items-start gap-2
                  border-b-1 border-b-outline bg-surface-container-high p-2`)}
              >
                <Button
                  appearance="text"
                  icon={<MaterialIcon icon="close" />}
                  alt={t("dialog.periodDetails.action.close")}
                  onClick={onClose}
                  className={cn(`!text-on-surface before:!bg-on-surface
                    [&_span]:!bg-on-surface`)}
                />
                <Text type="headline-small" element="h1" className="my-1 mr-4">
                  {getLocaleString(period.subject.name, locale)}
                </Text>
              </div>
              <DialogContent className="flex flex-col gap-4 p-6 pt-4">
                <PeriodDetailsContent period={period} />
                {editable && (
                  <Button
                    appearance="outlined"
                    icon={<MaterialIcon icon="delete" />}
                    dangerous
                    onClick={onDelete}
                    className="!mt-4"
                  >
                    {t("dialog.periodDetails.action.delete")}
                  </Button>
                )}
              </DialogContent>
            </motion.div>
          </div>

          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={transition(DURATION.medium4, EASING.standard)}
            className="skc-scrim"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default PeriodDetailsDialog;
