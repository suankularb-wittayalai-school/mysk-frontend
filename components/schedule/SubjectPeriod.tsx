// Imports
import HoverList from "@/components/person/HoverList";
import PeriodDetailsDialog from "@/components/schedule/PeriodDetailsDialog";
import SubjectPeriodMenu from "@/components/schedule/SubjectPeriodMenu";
import ScheduleContext from "@/contexts/ScheduleContext";
import deleteScheduleItem from "@/utils/backend/schedule/deleteScheduleItem";
import lengthenScheduleItem from "@/utils/backend/schedule/lengthenScheduleItem";
import moveScheduleItem from "@/utils/backend/schedule/moveScheduleItem";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { getSubjectName } from "@/utils/helpers/getSubjectName";
import periodDurationToWidth from "@/utils/helpers/schedule/periodDurationToWidth";
import positionPxToPeriod from "@/utils/helpers/schedule/positionPxToPeriod";
import useLocale from "@/utils/helpers/useLocale";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { PeriodContentItem } from "@/utils/types/schedule";
import {
  Interactive,
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import {
  AnimatePresence,
  PanInfo,
  motion,
  useAnimationControls,
  useDragControls,
} from "framer-motion";
import { useTranslation } from "next-i18next";
import { pick } from "radash";
import {
  FC,
  MouseEvent,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const SubjectPeriod: FC<{
  period: PeriodContentItem;
  day: Day;
  isInSession?: boolean;
}> = ({ period, day, isInSession }) => {
  const refreshProps = useRefreshProps();
  const locale = useLocale();
  const { t } = useTranslation(["schedule", "common"]);

  const { duration, easing } = useAnimationConfig();
  const animationControls = useAnimationControls();
  const dragControls = useDragControls();

  const supabase = useSupabaseClient();

  const { view, editable, periodWidth, periodHeight, constraintsRef } =
    useContext(ScheduleContext);

  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
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
    if (!editable) return;

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
        va.track("Delete Period");
        setDetailsOpen(false);
        const { error } = await deleteScheduleItem(supabase, period.id!);
        if (error) return false;
        await refreshProps();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  // Loading
  const [loading, toggleLoading] = useToggle();

  // Look at that drag
  async function handleDragEnd(
    _: globalThis.MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    await withLoading(
      async () => {
        // Track
        va.track("Move Period");

        // Get the rectangle
        const constraints = constraintsRef?.current;
        if (!constraints) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        const { startTime: newStartTime, day: newDay } = positionPxToPeriod(
          info.point.x,
          info.point.y,
          constraints,
        );

        // Validate position
        if (newStartTime === null) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        // Don’t do anything if the Period is in the same location
        if (newStartTime === period.start_time && newDay === day) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        // Save the change to Supabase
        const { error } = await moveScheduleItem(supabase, {
          ...pick(period, ["id", "duration"]),
          start_time: newStartTime,
          day: newDay,
        });

        if (error) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        // Visually move the Period
        animationControls.start({
          x: (newStartTime - period.start_time) * periodWidth,
          y: (newDay - day) * (periodHeight + 4),
        });

        // Refetch the Schedule
        await refreshProps();

        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  // Reset dragging when the window size changes
  function handleWindowResize() {
    animationControls.set({ x: 0, y: 0 });
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

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
      1,
    );
    setPeriodDuration(duration);
  }

  // Save the new duration to Supabase
  async function handleMouseUp() {
    setExtending(false);
    withLoading(
      async () => {
        // Track
        va.track("Extend Period");

        // Don’t do anything if the period’s duration stays the same
        if (
          periodDuration === period.duration ||
          period.start_time + periodDuration - 1 > 10
        ) {
          setExtending(false);
          return false;
        }

        // Save to Supabase
        const { error } = await lengthenScheduleItem(supabase, {
          id: period.id!,
          duration: periodDuration,
        });

        if (error) {
          setExtending(false);
          return false;
        }

        // Refetch the Schedule
        await refreshProps();

        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <>
      <motion.li
        ref={periodRef}
        layoutId={`period-${period.id}`}
        animate={animationControls}
        transition={transition(duration.medium2, easing.standard)}
        drag={editable}
        dragListener={false}
        dragControls={dragControls}
        whileDrag={{ boxShadow: "var(--shadow-3)", zIndex: 35 }}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => editable && setMenuOpen(true)}
        onMouseLeave={() => editable && !detailsOpen && setMenuOpen(false)}
        className={cn(
          `relative rounded-sm transition-shadow focus-within:shadow-2`,
          editable && "touch-none",
          !loading &&
            (isInSession ? `shadow-1 hover:shadow-2` : `hover:shadow-1`),
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
             state-layer:!bg-on-secondary-container
             [&>*]:w-full [&>*]:truncate [&>*]:break-all`,
            !(loading || extending) && isInSession
              ? `border-tertiary-container bg-tertiary-container
                 text-on-tertiary-container`
              : `bg-secondary-container text-on-secondary-container`,
            (loading || extending) && `bg-surface text-secondary`,
            editable
              ? `cursor-default overflow-visible border-4
                 border-secondary-container px-3 py-1`
              : `px-4 py-2`,
          )}
          style={{ width: periodDurationToWidth(period.duration) }}
          onClick={
            !editable
              ? () => {
                  va.track("Open Period Details");
                  setDetailsOpen(true);
                }
              : undefined
          }
        >
          {/* Subject name / class */}
          {view === "teacher" ? (
            <motion.span
              layoutId={`period-${period.id}-class`}
              transition={transition(
                duration.short2,
                easing.standardDecelerate,
              )}
              className="skc-text skc-text--title-medium !w-fit"
            >
              {t("class", {
                ns: "common",
                number: period.classrooms?.map(({ number }) => number).join(),
              })}
            </motion.span>
          ) : (
            <span
              className="skc-text skc-text--title-medium"
              title={
                view === "student"
                  ? getLocaleString(period.subject.name, locale)
                  : undefined
              }
            >
              {getSubjectName(period.duration, period.subject, locale)}
            </span>
          )}

          {/* Teacher / subject name */}
          {(view === "student" || !menuOpen || extending || loading) && (
            <Text type="body-small">
              {view === "teacher" ? (
                getSubjectName(period.duration, period.subject, locale)
              ) : (
                <HoverList people={period.teachers} />
              )}
            </Text>
          )}
        </Interactive>

        {/* Hover menu */}
        <SubjectPeriodMenu
          open={view === "teacher" && (extending || (!loading && menuOpen))}
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
                    easing.standardAccelerate,
                  ),
                }}
                aria-hidden
                className="absolute -right-12 bottom-0.5 z-20 text-secondary"
                transition={transition(
                  duration.short4,
                  easing.standardDecelerate,
                )}
              >
                <MaterialIcon icon="double_arrow" size={40} />
              </motion.div>

              {/* Result guide */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  width:
                    // Calculate period width by duration
                    periodDuration * 96 +
                    // Correct for missing gap in the middle of multi-period periods
                    (periodDuration - 1) * 8,
                }}
                exit={{ opacity: 0 }}
                transition={transition(duration.short4, easing.standard)}
                className="absolute inset-0 rounded-sm border-4 border-secondary"
              />
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
      <PeriodDetailsDialog
        period={period}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default SubjectPeriod;
