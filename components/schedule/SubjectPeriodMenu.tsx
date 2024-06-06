import ScheduleContext from "@/contexts/ScheduleContext";
import cn from "@/utils/helpers/cn";
import { formatSubjectPeriodName } from "@/utils/helpers/schedule/formatSubjectPeriodName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { PeriodContentItem } from "@/utils/types/schedule";
import {
  DURATION,
  EASING,
  Interactive,
  MaterialIcon,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, DragControls, motion } from "framer-motion";
import { usePlausible } from "next-plausible";
import useTranslation from "next-translate/useTranslation";
import { useContext, useState } from "react";

/**
 * A menu that appears when a Subject Period is hovered, allowing the user to
 * extend, move, or view the details of the Subject Period.
 * 
 * @param open Whether the menu is open.
 * @param period The Subject Period that the menu is for.
 * @param dragControls The Framer Motion drag controls.
 * @param extending Whether the user is extending the Subject Period.
 * @param setExtending Sets the extending state.
 * @param setDetailsOpen Opens the details dialog.
 */
const SubjectPeriodMenu: StylableFC<{
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
  style,
  className,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule/editor/hoverMenu");

  const { view } = useContext(ScheduleContext);
  const plausible = usePlausible();

  const entranceTransition = transition(
    DURATION.short4,
    EASING.standardDecelerate,
  );
  const exitTransition = transition(DURATION.short2, EASING.standardAccelerate);

  const [moving, setMoving] = useState(false);

  return (
    <AnimatePresence>
      {open && !extending && (
        <div
          style={style}
          className={cn(
            `absolute inset-0 flex h-14 flex-col rounded-sm p-1 pt-0.5`,
            moving && `bg-secondary-container`,
            className,
          )}
        >
          <motion.span
            layoutId={`period-${period.id}-class`}
            transition={entranceTransition}
            className="skc-text skc-text--body-small !font-display"
          >
            {view === UserRole.teacher
              ? t("common:class", {
                  number: period.classrooms
                    ?.map(({ number }) => number)
                    .sort((a, b) => a - b)
                    .join(),
                })
              : formatSubjectPeriodName(1, period.subject, locale)}
          </motion.span>

          <motion.div
            initial={{ y: "50%", scaleY: 0, opacity: 0 }}
            animate={{ y: "0%", scaleY: 1, opacity: 1 }}
            exit={{
              y: "50%",
              scaleY: 0,
              opacity: 0,
              transition: exitTransition,
            }}
            transition={entranceTransition}
            className={cn(
              `grid w-full grow gap-1`,
              moving || extending ? `grid-cols-1` : `grid-cols-[2fr,3fr,2fr]`,
            )}
          >
            {/* Move period */}
            {!extending && (
              <Interactive
                element="button"
                rippleEffect={false}
                shadowEffect
                attr={{
                  title: t("move"),
                  onPointerDown: (event) => {
                    setMoving(true);
                    dragControls.start(event);
                  },
                  onPointerUp: () => setMoving(false),
                }}
                className={cn(
                  `grid place-content-center rounded-xs transition-colors`,
                  moving
                    ? `cursor-grabbing bg-secondary text-on-secondary`
                    : `cursor-grab bg-surface text-on-surface`,
                )}
              >
                <MaterialIcon icon="drag_indicator" size={20} />
              </Interactive>
            )}

            {/* Period details Dialog trigger */}
            {!(moving || extending) && (
              <Interactive
                shadowEffect
                onClick={() => {
                  plausible("Open Period Details", {
                    props: { type: "Subject" },
                  });
                  setDetailsOpen(true);
                }}
                attr={{ title: t("more") }}
                className={cn(`tap-highlight-none grid place-content-center
                  rounded-xs bg-primary text-on-primary
                  state-layer:!bg-on-primary`)}
              >
                <MaterialIcon icon="open_in_full" />
              </Interactive>
            )}

            {/* Extend/shorten period */}
            {!moving && (
              <Interactive
                element="button"
                rippleEffect={false}
                shadowEffect
                attr={{
                  title: t("extend"),
                  onPointerDown: () => setExtending(true),
                }}
                className={cn(
                  `grid cursor-ew-resize place-content-center rounded-xs
                   transition-colors`,
                  extending
                    ? `bg-secondary text-on-secondary`
                    : `bg-surface text-on-surface`,
                )}
              >
                <MaterialIcon icon="straighten" size={20} />
              </Interactive>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubjectPeriodMenu;
