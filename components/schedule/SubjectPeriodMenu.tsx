// External libraries
import { AnimatePresence, DragControls, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

// SK Components
import {
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Helpers
import { cn } from "@/utils/helpers/className";

// Types
import { PeriodContentItem } from "@/utils/types/schedule";

const SubjectPeriodMenu: FC<{
  open: boolean;
  period: PeriodContentItem;
  dragControls: DragControls;
  extending: boolean;
  setExtending: (value: boolean) => void;
  setDetailsOpen: (value: boolean) => void;
}> = ({
  open,
  period,
  dragControls,
  extending,
  setExtending,
  setDetailsOpen,
}) => {
  // Translation
  const { t } = useTranslation(["schedule", "common"]);

  // Animation
  const { duration, easing } = useAnimationConfig();

  const entranceTransition = transition(
    duration.short4,
    easing.standardDecelerate
  );
  const exitTransition = transition(duration.short2, easing.standardAccelerate);

  // Moving
  const [moving, setMoving] = useState<boolean>(false);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="absolute inset-0 flex h-14 flex-col rounded-sm
            bg-secondary-container p-1 pt-0.5"
        >
          <motion.span
            layoutId={`period-${period.id}-class`}
            transition={entranceTransition}
            className="skc-body-small w-fit !font-display"
          >
            {t("class", { ns: "common", number: period.class!.number })}
          </motion.span>

          <motion.div
            initial={{ y: "50%", scaleY: 0 }}
            animate={{ y: "0%", scaleY: 1 }}
            exit={{ y: "50%", scaleY: 0, transition: exitTransition }}
            transition={entranceTransition}
            className={cn([
              `grid w-full grow gap-1`,
              moving || extending ? `grid-cols-1` : `grid-cols-[2fr,3fr,2fr]`,
            ])}
          >
            {/* Move period */}
            {!extending && (
              <button
                title={t("schedule.hoverMenu.move")}
                onPointerDown={(event) => {
                  setMoving(true);
                  dragControls.start(event);
                }}
                onPointerUp={() => setMoving(false)}
                className={cn([
                  `grid place-content-center rounded-xs
                   transition-colors`,
                  moving
                    ? `cursor-grabbing bg-secondary text-on-secondary`
                    : `cursor-grab bg-surface text-on-surface`,
                ])}
              >
                <MaterialIcon icon="drag_indicator" size={20} />
              </button>
            )}

            {/* Period details Dialog trigger */}
            {!(moving || extending) && (
              <button
                title={t("schedule.hoverMenu.more")}
                className="tap-highlight-none grid place-content-center
                  rounded-xs bg-primary text-on-primary"
                onClick={() => setDetailsOpen(true)}
              >
                <MaterialIcon icon="open_in_full" />
              </button>
            )}

            {/* Extend/shorten period */}
            {!moving && (
              <button
                title={t("schedule.hoverMenu.extend")}
                onPointerDown={() => setExtending(true)}
                className={cn([
                  `grid cursor-ew-resize place-content-center rounded-xs
                   transition-colors`,
                  extending
                    ? `bg-secondary text-on-secondary`
                    : `bg-surface text-on-surface`,
                ])}
              >
                <MaterialIcon icon="straighten" size={20} />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubjectPeriodMenu;
