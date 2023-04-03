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

// Types
import { PeriodContentItem } from "@/utils/types/schedule";
import { cn } from "@/utils/helpers/className";

const SubjectPeriodMenu: FC<{
  open: boolean;
  period: PeriodContentItem;
  dragControls: DragControls;
  setDetailsOpen: (open: boolean) => void;
}> = ({ open, period, dragControls, setDetailsOpen }) => {
  // Translation
  const { t } = useTranslation(["schedule", "common"]);

  // Animation
  const { duration, easing } = useAnimationConfig();

  const entranceTransition = transition(
    duration.short4,
    easing.standardDecelerate
  );
  const exitTransition = transition(duration.short2, easing.standardAccelerate);

  const [moving, setMoving] = useState<boolean>(false);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="absolute top-0 left-0 flex h-14 w-24 flex-col rounded-sm
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
              `grid grow gap-1`,
              moving ? `grid-cols-1` : `grid-cols-[1fr,2.25rem,1fr]`,
            ])}
          >
            <button
              title={t("schedule.hoverMenu.move")}
              onPointerDown={(event) => {
                setMoving(true);
                dragControls.start(event);
              }}
              onPointerUp={() => setMoving(false)}
              className={cn([
                `grid cursor-grab place-content-center rounded-xs bg-surface
                 text-on-surface transition-colors`,
                moving && `cursor-grabbing bg-secondary text-on-secondary`,
              ])}
            >
              <MaterialIcon icon="drag_indicator" size={20} />
            </button>
            {!moving && (
              <>
                <button
                  title={t("schedule.hoverMenu.more")}
                  className="grid place-content-center rounded-xs bg-primary text-on-primary"
                  onClick={() => setDetailsOpen(true)}
                >
                  <MaterialIcon icon="open_in_full" />
                </button>
                <button
                  title={t("schedule.hoverMenu.extend")}
                  className="grid cursor-ew-resize place-content-center rounded-xs
                    bg-surface text-on-surface"
                >
                  <MaterialIcon icon="straighten" size={20} />
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubjectPeriodMenu;
