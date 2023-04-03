// External libraries
import { useTranslation } from "next-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

// SK Components
import {
  Button,
  DialogContent,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Helpers
import { getLocaleObj } from "@/utils/helpers/i18n";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { DialogComponent } from "@/utils/types/common";
import { PeriodContentItem } from "@/utils/types/schedule";
import PeriodDetailsContent from "./PeriodDetailsContent";

const PeriodDetails: DialogComponent<{ period: PeriodContentItem }> = ({
  period,
  open,
  onClose,
}) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("schedule");

  // Animation
  const { duration, easing } = useAnimationConfig();

  // Close the Dialog with the escape key
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
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
                className="flex flex-row items-start gap-2 border-b-1
                  border-b-outline bg-surface-3 p-2"
              >
                <Button
                  appearance="text"
                  icon={<MaterialIcon icon="close" />}
                  onClick={onClose}
                  className="!text-on-surface before:!bg-on-surface
                    [&_span]:!bg-on-surface"
                />
                <h1 className="skc-headline-small my-1 mr-4">
                  {getLocaleObj(period.subject.name, locale).name}
                </h1>
              </div>
              <DialogContent className="flex flex-col gap-4 p-6 pt-4">
                <PeriodDetailsContent period={period} />
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
