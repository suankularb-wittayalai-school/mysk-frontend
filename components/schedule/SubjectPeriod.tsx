// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  AnimatePresence,
  PanInfo,
  motion,
  useAnimationControls,
  useDragControls,
} from "framer-motion";
import {
  FC,
  MouseEvent,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// SK Components
import {
  MaterialIcon,
  transition,
  useAnimationConfig,
  useBreakpoint,
} from "@suankularb-components/react";

// Internal components
import HoverList from "@/components/person/HoverList";
import PeriodDetails from "@/components/schedule/PeriodDetails";
import SubjectPeriodMenu from "@/components/schedule/SubjectPeriodMenu";

// Contexts
import ScheduleContext from "@/contexts/ScheduleContext";

// Backend
import {
  deleteScheduleItem,
  editScheduleItemDuration,
  moveScheduleItem,
} from "@/utils/backend/schedule/schedule";

// Helpers
import { cn } from "@/utils/helpers/className";
import { getLocaleObj } from "@/utils/helpers/i18n";
import { withLoading } from "@/utils/helpers/loading";
import { getSubjectName } from "@/utils/helpers/schedule";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { PeriodContentItem } from "@/utils/types/schedule";

const SubjectPeriod: FC<{
  period: PeriodContentItem;
  day: Day;
  isInSession?: boolean;
}> = ({ period, day, isInSession }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation(["schedule", "common"]);

  // Router
  const router = useRouter();

  // Animation
  const { duration, easing } = useAnimationConfig();
  const animationControls = useAnimationControls();
  const dragControls = useDragControls();

  // Supabase
  const supabase = useSupabaseClient();

  // Context
  const { role, teacherID, constraintsRef } = useContext(ScheduleContext);

  // Dialog control
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  // Hover menu
  const { atBreakpoint } = useBreakpoint();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Keyboard support for opening/closing hover menu
  let tabOutCloseTimeout: NodeJS.Timeout;
  function openMenu() {
    if (tabOutCloseTimeout) clearTimeout(tabOutCloseTimeout);
    setMenuOpen(true);
  }
  function closeMenu() {
    if (!detailsOpen)
      tabOutCloseTimeout = setTimeout(() => setMenuOpen(false), 600);
  }
  useEffect(() => {
    const period = periodRef?.current;
    if (!period) return;

    period.addEventListener("focusin", openMenu);
    period.addEventListener("focusout", closeMenu);

    return () => {
      period.removeEventListener("focusin", openMenu);
      period.removeEventListener("focusout", closeMenu);
    };
  }, []);

  // Close the hover menu after the Dialog fully closes to prevent glitchy
  // container transform effect
  let dialogCloseTimeout: NodeJS.Timeout;
  useEffect(() => {
    if (!detailsOpen)
      dialogCloseTimeout = setTimeout(() => setMenuOpen(false), 500);
    return () => clearTimeout(dialogCloseTimeout);
  }, [detailsOpen]);

  async function handleDelete() {
    withLoading(
      async () => {
        setDetailsOpen(false);
        const { error } = await deleteScheduleItem(supabase, period.id!);
        if (error) return false;
        await router.replace(router.asPath);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }

  // Loading
  const [loading, toggleLoading] = useToggle();

  // Period width and height (used in move and extend)
  const periodWidth = 104; // 96 + 8
  const periodHeight = 60; // 56 + 4

  // Look at that drag
  async function handleDragEnd(
    _: globalThis.MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    await withLoading(
      async () => {
        // Get the rectangle
        const constraints = constraintsRef?.current;
        if (!constraints) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }
        const { top, left } = constraints.getBoundingClientRect();

        // Calculate the drop position within the Schedule content area
        const dropPosition = {
          top: info.point.y - top - 60,
          left: info.point.x - left - 152,
        };

        // Validate position
        if (dropPosition.left < 0 || dropPosition.top < 0) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        // Calculate new `startTime` and `day`
        const newStartTime = Math.min(
          Math.max(
            Math.ceil(
              (dropPosition.left +
                constraints.scrollLeft -
                periodWidth * 0.75) /
                periodWidth
            ) + 1,
            1
          ),
          10
        );
        const newDay = Math.min(
          Math.max(Math.ceil(dropPosition.top / periodHeight), 1),
          5
        ) as Day;

        // Don’t do anything if the Period is in the same location
        if (newStartTime === period.startTime && newDay === day) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        // Save the change to Supabase
        const { error } = await moveScheduleItem(
          supabase,
          newDay,
          { ...period, startTime: newStartTime },
          teacherID!
        );

        if (error) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        // Visually move the Period
        animationControls.start({
          x: (newStartTime - period.startTime) * periodWidth,
          y: (newDay - day) * (periodHeight + 4),
        });

        // Refetch the Schedule
        await router.replace(router.asPath);

        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }

  // Period extension
  const periodRef: RefObject<HTMLLIElement> = useRef(null);
  const [extending, setExtending] = useState<boolean>(false);
  const [periodDuration, setPeriodDuration] = useState<number>(period.duration);

  useEffect(() => {
    if (extending) setPeriodDuration(period.duration);
  }, [extending]);

  // Update the calculated resulting duration when the mouse moves
  async function handleMouseMove(event: MouseEvent) {
    // Get the rectangle
    const period = periodRef?.current;
    if (!period) return;

    const { left } = period.getBoundingClientRect();

    // Calculate the drop position within the Schedule content area
    const duration = Math.max(
      Math.round((event.clientX - left) / periodWidth),
      1
    );
    setPeriodDuration(duration);
  }

  // Save the new duration to Supabase
  async function handleMouseUp() {
    setExtending(false);
    withLoading(
      async () => {
        // Don’t do anything if the period’s duration stays the same
        if (periodDuration === period.duration) {
          setExtending(false);
          return false;
        }

        // Save to Supabase
        const { error } = await editScheduleItemDuration(
          supabase,
          day,
          { ...period, duration: periodDuration },
          teacherID!
        );

        if (error) {
          setExtending(false);
          return false;
        }

        // Refetch the Schedule
        await router.replace(router.asPath);

        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }

  return (
    <>
      <motion.li
        ref={periodRef}
        layoutId={`period-${period.id}`}
        animate={animationControls}
        transition={transition(duration.medium2, easing.standard)}
        drag={role === "teacher"}
        dragListener={false}
        dragControls={dragControls}
        whileDrag={{ boxShadow: "var(--shadow-3)", zIndex: 35 }}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => !detailsOpen && setMenuOpen(false)}
        className={cn([
          `relative touch-none rounded-sm transition-shadow focus-within:shadow-2`,
          !loading &&
            (isInSession ? `shadow-1 hover:shadow-2` : `hover:shadow-1`),
        ])}
      >
        {/* Period content */}
        <button
          className={cn([
            `tap-highlight-none flex h-14 w-24 flex-col rounded-sm border-4
             border-secondary-container bg-secondary-container px-3 py-1
             text-left text-on-secondary-container
             transition-[border,background-color,color]`,
            !loading && isInSession
              ? `border-tertiary-container bg-tertiary-container
                 text-on-tertiary-container`
              : `bg-secondary-container text-on-secondary-container`,
            extending && "bg-transparent",
            loading && "bg-surface text-secondary",
            role === "teacher" && "cursor-default",
          ])}
          style={{
            width:
              // Calculate period width by duration
              period.duration * 96 +
              // Correct for missing gap in the middle of multi-period periods
              (period.duration - 1) * 8,
          }}
          onClick={() => role === "student" && setDetailsOpen(true)}
        >
          {/* Subject name / class */}
          {role === "teacher" ? (
            <motion.span
              layoutId={`period-${period.id}-class`}
              transition={transition(
                duration.short2,
                easing.standardDecelerate
              )}
              className="skc-title-medium truncate"
            >
              {t("class", { ns: "common", number: period.class!.number })}
            </motion.span>
          ) : (
            <span
              className="skc-title-medium truncate"
              title={
                role === "student"
                  ? getLocaleObj(period.subject.name, locale).name
                  : undefined
              }
            >
              {getSubjectName(period.duration, period.subject.name, locale)}
            </span>
          )}

          {/* Teacher / subject name */}
          <span className="skc-body-small">
            {role === "teacher" ? (
              getSubjectName(period.duration, period.subject.name, locale)
            ) : (
              <HoverList people={period.subject.teachers} />
            )}
          </span>
        </button>

        {/* Hover menu */}
        <SubjectPeriodMenu
          open={role === "teacher" && (extending || (!loading && menuOpen))}
          {...{ period, dragControls, extending, setExtending, setDetailsOpen }}
        />

        {/* Extension hints */}
        <AnimatePresence>
          {extending && (
            <>
              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0, x: -30 }}
                animate={{ opacity: 1, scaleY: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  scaleY: 0,
                  x: -10,
                  transition: transition(
                    duration.short2,
                    easing.standardAccelerate
                  ),
                }}
                className="absolute -right-12 bottom-0.5 z-20 text-secondary"
                transition={transition(
                  duration.short4,
                  easing.standardDecelerate
                )}
              >
                <MaterialIcon icon="double_arrow" size={40} />
              </motion.div>

              {/* End guide */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{
                  opacity: 1,
                  scaleY: 1,
                  x:
                    periodDuration > 1 ? periodWidth * (periodDuration - 2) : 0,
                }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={transition(duration.short4, easing.standard)}
                className={cn([
                  `skc-body-medium absolute -top-1 -bottom-1 left-0 z-10 flex
                   flex-col items-end border-r-4 border-secondary
                   bg-gradient-to-l from-secondary-container pr-1
                   transition-[width]`,
                  periodDuration > 1 ? "w-[12.5rem]" : "w-24",
                ])}
              >
                {t("schedule.periodLength", { count: periodDuration })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.li>

      {/* Extension capture area */}
      {extending && (
        <div
          aria-hidden
          className="fixed inset-0 z-20 cursor-ew-resize touch-none
            select-none"
          onPointerMove={handleMouseMove}
          onPointerUp={handleMouseUp}
          onClick={handleMouseUp}
        />
      )}

      {/* Dialog */}
      <PeriodDetails
        period={period}
        role={role}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default SubjectPeriod;
