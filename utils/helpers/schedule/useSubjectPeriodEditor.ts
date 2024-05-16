import ScheduleContext from "@/contexts/ScheduleContext";
import deleteScheduleItem from "@/utils/backend/schedule/deleteScheduleItem";
import lengthenScheduleItem from "@/utils/backend/schedule/lengthenScheduleItem";
import moveScheduleItem from "@/utils/backend/schedule/moveScheduleItem";
import positionPxToPeriod from "@/utils/helpers/schedule/positionPxToPeriod";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { PeriodContentItem } from "@/utils/types/schedule";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  PanInfo,
  motion,
  useAnimationControls,
  useDragControls,
} from "framer-motion";
import { usePlausible } from "next-plausible";
import { pick } from "radash";
import {
  ComponentProps,
  MouseEvent,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Custom hook for managing the editing of a Subject Period.
 *
 * @param period The Period Content Item to edit.
 * @param day The day of the week for the period.
 *
 * @returns Sorted alphabetically:
 * | Property            | Description                                          |
 * |---------------------|------------------------------------------------------|
 * | `animationControls` | The Framer Motion controls for animating the Period. |
 * | `detailsOpen`       | If the Subject Period Details Dialog is open.        |
 * | `dragControls`      | The Framer Motion controls for dragging the Period.  |
 * | `extending`         | If the Period is being extended.                     |
 * | `handleDelete`      | Deletes the Period.                                  |
 * | `handleDragEnd`     | Handles the end of dragging (moving) the Period.     |
 * | `handleMouseMove`   | Handles the mouse moving while extending the Period. |
 * | `handleMouseUp`     | Handles the end of extending the Period.             |
 * | `listeners`         | Event listeners for various elements of the Period.  |
 * | `loading`           | If changes are being pushed to the database.         |
 * | `menuOpen`          | If the Subject Period Menu is open.                  |
 * | `periodRef`         | The reference to the underlying HTML element.        |
 * | `periodDuration`    | The visual extensiosn duration of the Period.        |
 * | `setDetailsOpen`    | Sets the state of the Subject Period Details Dialog. |
 * | `setExtending`      | Sets the state of the Period extension.              |
 * | `setMenuOpen`       | Sets the state of the Subject Period Menu.           |
 * | `toggleLoading`     | Toggles the loading state of the Period.             |
 */
export default function useSubjectPeriodEditor(
  period: PeriodContentItem,
  day: number,
) {
  const plausible = usePlausible();

  const animationControls = useAnimationControls();
  const dragControls = useDragControls();

  const supabase = useSupabaseClient();

  const { editable, periodWidth, periodHeight, constraintsRef, onEdit } =
    useContext(ScheduleContext);

  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Keyboard support for opening/closing hover menu:
  // When tabbing in, open the menu. When tabbing out, close the menu after a
  // short delay.
  let tabOutCloseTimeout: NodeJS.Timeout;

  /** Opens the menu immediately. */
  function openMenu() {
    if (tabOutCloseTimeout) clearTimeout(tabOutCloseTimeout);
    setMenuOpen(true);
  }
  /** Closes the meny after a short delay. */
  function closeMenu() {
    if (!detailsOpen)
      tabOutCloseTimeout = setTimeout(() => setMenuOpen(false), 600);
  }
  useEffect(() => {
    if (!editable) return;

    // Add event listeners for tabbing in/out.
    const period = periodRef?.current;
    if (!period) return;
    period.addEventListener("focusin", openMenu);
    period.addEventListener("focusout", closeMenu);
    return () => {
      period.removeEventListener("focusin", openMenu);
      period.removeEventListener("focusout", closeMenu);
    };
  }, []);

  /** Deletes the period. */
  async function handleDelete() {
    withLoading(
      async () => {
        plausible("Delete Period");
        setDetailsOpen(false);
        const { error } = await deleteScheduleItem(supabase, period.id!);
        if (error) return false;
        await onEdit?.();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  const [loading, toggleLoading] = useToggle();

  /** Handles the end of dragging (moving) the Period. */
  async function handleDragEnd(_: unknown, info: PanInfo) {
    await withLoading(
      async () => {
        // Analytics.
        plausible("Move Period");

        // Get the rectangle.
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

        // Validate position.
        if (newStartTime === null) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        // Don’t do anything if the Period is in the same location.
        if (newStartTime === period.start_time && newDay === day) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        // Save the change to Supabase.
        const { error } = await moveScheduleItem(supabase, {
          ...pick(period, ["id", "duration"]),
          start_time: newStartTime,
          day: newDay,
        });

        if (error) {
          animationControls.start({ x: 0, y: 0 });
          return false;
        }

        // Visually move the Period.
        animationControls.start({
          x: (newStartTime - period.start_time) * periodWidth,
          y: (newDay - day) * (periodHeight + 4),
        });

        // Refetch the Schedule.
        await onEdit?.();

        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  /** Resets dragging when the window size changes */
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

  /** Updates the calculated resulting duration when the mouse moves. */
  async function handleMouseMove(event: MouseEvent) {
    // Get the rectangle.
    const period = periodRef?.current;
    if (!period) return;

    const { left } = period.getBoundingClientRect();

    // Calculate the drop position within the Schedule content area.
    const duration = Math.max(
      Math.round((event.clientX - left) / periodWidth),
      1,
    );
    setPeriodDuration(duration);
  }

  // Save the new duration to Supabase.
  async function handleMouseUp() {
    setExtending(false);
    withLoading(
      async () => {
        // Analytics.
        plausible("Extend Period");

        // Don’t do anything if the period’s duration stays the same.
        if (
          periodDuration === period.duration ||
          period.start_time + periodDuration - 1 > 10
        ) {
          setExtending(false);
          return false;
        }

        // Save to Supabase.
        const { error } = await lengthenScheduleItem(supabase, {
          id: period.id!,
          duration: periodDuration,
        });

        if (error) {
          setExtending(false);
          return false;
        }

        // Refetch the Schedule.
        await onEdit?.();

        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return {
    /** The Framer Motion controls for animating the Period. */
    animationControls,
    /** If the Subject Period Details Dialog is open. */
    detailsOpen,
    /** The Framer Motion controls for dragging the Period. */
    dragControls,
    /** If the Period is being extended. */
    extending,
    /** Deletes the Period. */
    handleDelete,
    /** Handles the end of dragging (moving) the Period. */
    handleDragEnd,
    /** Handles the mouse moving while extending the Period. */
    handleMouseMove,
    /** Handles the end of extending the Period. */
    handleMouseUp,
    /**
     * Event listeners for various elements of the Period.
     *
     * @example
     * ```tsx
     * const { listeners } = useSubjectPeriodEditor(period, day);
     * return <Interactive {...listeners.interactive} />;
     * ```
     */
    listeners: {
      /** For the top-level `<motion.li>`. */
      li: {
        onDragEnd: handleDragEnd,
        onMouseEnter: () => editable && setMenuOpen(true),
        onMouseLeave: () => editable && !detailsOpen && setMenuOpen(false),
      },
      /** For the `<Interactive>` right under `<motion.li>`. */
      interactive: {
        onClick: !editable ? () => setDetailsOpen(true) : undefined,
      },
      /** For the `<div>` working as extension capture. */
      extentionCapture: {
        onPointerMove: handleMouseMove,
        onPointerUp: handleMouseUp,
        onClick: handleMouseUp,
      },
    } satisfies Record<string, ComponentProps<typeof motion.div>>,
    /** If changes are being pushed to the database. */
    loading,
    /** If the Subject Period Menu is open. */
    menuOpen,
    /** The reference to the underlying HTML element. */
    periodRef,
    /** The visual extensiosn duration of the Period. */
    periodDuration,
    /** Sets the state of the Subject Period Details Dialog. */
    setDetailsOpen,
    /** Sets the state of the Period extension. */
    setExtending,
    /** Sets the state of the Subject Period Menu. */
    setMenuOpen,
    /** Toggles the loading state of the Period. */
    toggleLoading,
  };
}
