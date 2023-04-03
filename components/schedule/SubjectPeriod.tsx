// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  AnimatePresence,
  PanInfo,
  motion,
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
  Progress,
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
  const { t } = useTranslation("common");

  // Router
  const router = useRouter();

  // Animation
  const { duration, easing } = useAnimationConfig();
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
  useEffect(() => {
    const period = periodRef?.current;
    if (!period) return;

    period.addEventListener("focusin", () => setMenuOpen(true));
    period.addEventListener("focusout", () => setMenuOpen(false));

    return () => {
      period.removeEventListener("focusin", () => setMenuOpen(true));
      period.removeEventListener("focusout", () => setMenuOpen(false));
    };
  }, []);

  // Close the hover menu after the Dialog fully closes to prevent glitchy
  // container transform effect
  useEffect(() => {
    if (!detailsOpen) {
      setTimeout(() => setMenuOpen(false), 500);
    }
  }, [detailsOpen]);

  // Loading
  const [loading, toggleLoading] = useToggle();

  // Period width and height (used in move and extend)
  const periodWidth = 104; // 96 + 8
  const periodHeight = 60; // 56 + 4

  // Look at that drag
  const [dragFailed, setDragFailed] = useState<boolean>(false);

  async function handleDragEnd(
    _: globalThis.MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    await withLoading(
      async () => {
        // Get the rectangle
        const constraints = constraintsRef?.current;
        if (!constraints) {
          setDragFailed(true);
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
          setDragFailed(true);
          return false;
        }

        // Calculate new `startTime` and `day`
        const startTime =
          Math.ceil(
            (dropPosition.left + constraints.scrollLeft - periodWidth / 2) /
              periodWidth
          ) + 1;
        const day = Math.ceil(dropPosition.top / periodHeight) as Day;

        // Don’t do anything if the period is in the same location
        if (startTime === period.startTime) {
          setDragFailed(true);
          return false;
        }

        // Save the change to Supabase
        const { error } = await moveScheduleItem(
          supabase,
          day,
          { ...period, startTime },
          teacherID!
        );

        if (error) {
          setDragFailed(true);
          return false;
        }

        // Refetch the Schedule
        await router.replace(router.asPath);
        setDragFailed(false);

        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );

    setDragFailed(false);
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
        animate={!dragFailed ? { x: 0, y: 0 } : undefined}
        transition={transition(duration.medium2, easing.standard)}
        drag={role === "teacher" && atBreakpoint !== "base"}
        dragListener={false}
        dragControls={dragControls}
        whileDrag={{ boxShadow: "var(--shadow-3)", zIndex: 35 }}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => atBreakpoint !== "base" && setMenuOpen(true)}
        onMouseLeave={() => !detailsOpen && setMenuOpen(false)}
        className="relative touch-none rounded-sm transition-shadow"
        style={{ transform: "none" }}
      >
        {/* Period content */}
        <button
          className={cn([
            `tap-highlight-none flex h-14 w-24 flex-col rounded-sm
           bg-secondary-container px-4 py-2 text-left
           text-on-secondary-container
           transition-[background-color,color,box-shadow] focus:shadow-2`,
            !loading && isInSession
              ? `bg-tertiary-container text-on-tertiary-container shadow-1
               hover:shadow-2`
              : `bg-secondary-container text-on-secondary-container
               hover:shadow-1`,
            loading && "grid place-content-center",
          ])}
          style={{
            width:
              // Calculate period width by duration
              period.duration * 96 +
              // Correct for missing gap in the middle of multi-period periods
              (period.duration - 1) * 8,
          }}
          onClick={() =>
            (role === "student" || atBreakpoint === "base") &&
            setDetailsOpen(true)
          }
        >
          {loading ? (
            // Spinning Progress while saving new position
            <Progress
              appearance="circular"
              alt="Saving your changes…"
              visible
              className="!h-8 !w-8"
            />
          ) : (
            <>
              {/* Subject name / class */}
              <motion.span
                layoutId={`period-${period.id}-class`}
                transition={transition(
                  duration.short2,
                  easing.standardDecelerate
                )}
                className="skc-title-medium truncate"
                title={getLocaleObj(period.subject.name, locale).name}
              >
                {role === "teacher"
                  ? t("class", { number: period.class!.number })
                  : getSubjectName(
                      period.duration,
                      period.subject.name,
                      locale
                    )}
              </motion.span>

              {/* Teacher / subject name */}
              <span className="skc-body-small">
                {role === "teacher" ? (
                  getSubjectName(period.duration, period.subject.name, locale)
                ) : (
                  <HoverList people={period.subject.teachers} />
                )}
              </span>
            </>
          )}
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
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  x:
                    periodDuration > 1 ? periodWidth * (periodDuration - 2) : 0,
                }}
                exit={{ opacity: 0 }}
                transition={transition(duration.short4, easing.standard)}
                className={cn([
                  `absolute inset-0 rounded-sm bg-gradient-to-l
                   from-secondary-container transition-[width]`,
                  periodDuration > 1 ? "w-[12.5rem]" : "w-24",
                ])}
              />
            </>
          )}
        </AnimatePresence>
      </motion.li>

      {/* Extension capture area */}
      {extending && (
        <div
          aria-hidden
          className="fixed inset-0 cursor-ew-resize touch-none select-none"
          onPointerMove={handleMouseMove}
          onPointerUp={handleMouseUp}
          onClick={handleMouseUp}
        />
      )}

      {/* Dialog */}
      <PeriodDetails
        period={period}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
};

export default SubjectPeriod;
