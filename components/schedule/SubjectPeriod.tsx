import ExtensionHints from "@/components/schedule/ExtensionHints";
import PeriodDetailsDialog from "@/components/schedule/PeriodDetailsDialog";
import SubjectPeriodMenu from "@/components/schedule/SubjectPeriodMenu";
import SubjectPeriodText from "@/components/schedule/SubjectPeriodText";
import ScheduleContext from "@/contexts/ScheduleContext";
import cn from "@/utils/helpers/cn";
import periodDurationToWidth from "@/utils/helpers/schedule/periodDurationToWidth";
import useSubjectPeriodEditor from "@/utils/helpers/schedule/useSubjectPeriodEditor";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { PeriodContentItem } from "@/utils/types/schedule";
import {
  DURATION,
  EASING,
  Interactive,
  transition,
} from "@suankularb-components/react";
import { Day } from "date-fns";
import { motion } from "framer-motion";
import { useContext } from "react";

/**
 * A variant of Schedule Period for single subjects. Editable if set in the
 * context.
 *
 * @param period The Period Content Item to display.
 * @param day The day of the week this Period is on.
 * @param isInSession Whether this Period is currently in session.
 */
const SubjectPeriod: StylableFC<{
  period: PeriodContentItem;
  day: Day;
  isInSession?: boolean;
}> = ({ period, day, isInSession, style, className }) => {
  const { view, editable, constraintsRef } = useContext(ScheduleContext);

  const {
    animationControls,
    detailsOpen,
    dragControls,
    extending,
    handleDelete,
    listeners,
    loading,
    menuOpen,
    periodRef,
    periodDuration,
    setDetailsOpen,
    setExtending,
    setMenuOpen,
  } = useSubjectPeriodEditor(period, day);

  return (
    <>
      <motion.li
        ref={periodRef}
        layoutId={`period-${period.id}`}
        animate={animationControls}
        transition={transition(DURATION.medium2, EASING.standard)}
        drag={editable}
        dragListener={false}
        dragControls={dragControls}
        whileDrag={{ boxShadow: "var(--shadow-3)", zIndex: 35 }}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        {...listeners.li}
        style={style}
        className={cn(
          `relative rounded-sm transition-shadow focus-within:shadow-2`,
          editable && "touch-none",
          !loading &&
            (isInSession ? `shadow-1 hover:shadow-2` : `hover:shadow-1`),
          className,
        )}
      >
        {/* Period content */}
        <Interactive
          stateLayerEffect={editable}
          rippleEffect={editable}
          className={cn(
            `tap-highlight-none flex h-14 w-24 flex-col rounded-sm
            bg-secondary-container text-left text-on-secondary-container
            transition-[border,background-color,color]
            state-layer:!bg-on-secondary-container [&>*]:w-full [&>*]:truncate
            [&>*]:break-all`,
            loading || extending
              ? `bg-surface text-secondary`
              : isInSession
                ? `border-tertiary-container bg-tertiary-container
                  text-on-tertiary-container`
                : `bg-secondary-container text-on-secondary-container`,
            editable
              ? `cursor-default overflow-visible border-4
                border-secondary-container px-3 py-1`
              : `px-4 py-2`,
          )}
          style={{ width: periodDurationToWidth(period.duration) }}
          {...listeners.interactive}
        >
          {(!menuOpen || loading) && <SubjectPeriodText period={period} />}
        </Interactive>

        {/* Hover menu */}
        <SubjectPeriodMenu
          open={
            view === UserRole.teacher && (extending || (!loading && menuOpen))
          }
          period={period}
          dragControls={dragControls}
          extending={extending}
          setExtending={setExtending}
          setDetailsOpen={setDetailsOpen}
        />

        {/* Extension hints */}
        <ExtensionHints open={extending} duration={periodDuration} />
      </motion.li>

      {/* Extension capture area */}
      {extending && (
        <div
          aria-hidden
          className="fixed inset-0 z-20 cursor-ew-resize touch-none select-none"
          {...listeners.extentionCapture}
        />
      )}

      {/* Dialog */}
      <PeriodDetailsDialog
        period={period}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setMenuOpen(false);
        }}
        onDelete={handleDelete}
      />
    </>
  );
};

export default SubjectPeriod;
