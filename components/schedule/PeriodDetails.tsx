// Imports
import PeriodDetailsContent from "@/components/schedule/PeriodDetailsContent";
import ScheduleContext from "@/contexts/ScheduleContext";
import { getLocaleString } from "@/utils/helpers/string";
import { useLocale } from "@/utils/hooks/i18n";
import { DialogFC } from "@/utils/types/component";
import { PeriodContentItem } from "@/utils/types/schedule";
import {
  Button,
  DialogContent,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useContext, useEffect } from "react";

const PeriodDetails: DialogFC<{
  period: PeriodContentItem;
  onDelete?: () => void;
}> = ({ period, open, onClose, onDelete }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule");

  const { duration, easing } = useAnimationConfig();

  const { editable } = useContext(ScheduleContext);

  // Close the Dialog with the escape key
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dialog container (for positioning) */}
          <div
            className="pointer-events-none fixed inset-0 z-[100] grid
              place-items-center"
          >
            {/* Dialog */}
            <motion.div
              role="alertdialog"
              aria-modal
              layoutId={`period-${period.id}`}
              transition={transition(duration.medium4, easing.standard)}
              className="pointer-events-auto w-80 overflow-hidden rounded-xl
                bg-surface-3 text-on-surface-variant"
            >
              <div
                className="grid grid-cols-[2.5rem,auto] items-start gap-2 border-b-1
                  border-b-outline bg-surface-3 p-2"
              >
                <Button
                  appearance="text"
                  icon={<MaterialIcon icon="close" />}
                  alt={t("dialog.periodDetails.action.close")}
                  onClick={onClose}
                  className="!text-on-surface before:!bg-on-surface
                    [&_span]:!bg-on-surface"
                />
                <h1 className="skc-headline-small my-1 mr-4">
                  {getLocaleString(period.subject.name, locale)}
                </h1>
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
            transition={transition(duration.medium4, easing.standard)}
            className="skc-scrim"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default PeriodDetails;
