// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { Trans, useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Backend
import { editScheduleItemDuration } from "@/utils/backend/schedule/schedule";

// Helpers
import { isTouchDevice } from "@/utils/helpers/browser";

// Hooks
import { useTeacherAccount } from "@/utils/hooks/auth";

// Types
import { PeriodContentItem } from "@/utils/types/schedule";

const PeriodHoverMenu = ({
  show: givenShow,
  day,
  schedulePeriod,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
  setDragging,
}: {
  show: boolean;
  day: Day;
  schedulePeriod: PeriodContentItem;
  setEditPeriod?: ({
    show,
    day,
    schedulePeriod,
  }: {
    show: boolean;
    day: Day;
    schedulePeriod: PeriodContentItem;
  }) => void;
  setDeletePeriod?: ({
    show,
    periodID,
  }: {
    show: boolean;
    periodID: number;
  }) => void;
  toggleFetched?: () => void;
  setDragging: (value: boolean) => void;
}): JSX.Element => {
  // Translation
  const { t } = useTranslation("schedule");

  // Animation
  const { duration, easing } = useAnimationConfig();

  // Database
  const supabase = useSupabaseClient();
  const [teacher] = useTeacherAccount();

  const [listeningCursor, setListeningCursor] = useState<boolean>(false);
  const [cursorStart, setCursorStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [disableTutorial, setDisableTutorial] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(givenShow);
  useEffect(() => setShow(givenShow), [givenShow]);
  useEffect(() => {
    if (!show) setDisableTutorial(false);
  }, [show]);

  // Component-specific utils
  function findNumPeriodsFromCursor(
    initial: number,
    xStart: number,
    xEnd: number
  ): number {
    return initial + Math.floor((xEnd - xStart + 40) / 112);
  }

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            className="bg-secondary-translucent-12 pointer-events-none absolute
              z-30 h-full w-full rounded-md border-2 border-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition(duration.short4, easing.standard)}
          >
            <div className="relative h-full w-full">
              {/* Helper message */}
              {isTouchDevice() && !disableTutorial && (
                <motion.p
                  className="inverse-surface shadow absolute bottom-1 left-1
                    flex h-6 w-fit items-center gap-1 whitespace-nowrap
                    rounded-md px-2 font-body font-medium"
                  initial={{ scale: 0.9, y: 5, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 5, opacity: 0 }}
                  transition={transition(duration.short4, easing.standard)}
                >
                  {!listeningCursor ? (
                    <Trans i18nKey="schedule.extendGuide.initial" ns="schedule">
                      Tap <MaterialIcon icon="straighten" /> to extend period
                    </Trans>
                  ) : (
                    t("schedule.extendGuide.tapToExtend")
                  )}
                </motion.p>
              )}

              {/* Edit/delete group */}
              <div
                className="shadow absolute top-0 left-1/2 flex w-fit
                  -translate-x-1/2 -translate-y-1/2 flex-row gap-0.5
                  overflow-hidden rounded-full border-2 border-surface
                  bg-surface"
              >
                {/* Edit button */}
                <button
                  className="primary pointer-events-auto p-1 text-xl
                    transition-[opacity] hover:opacity-95 hover:transition-none
                    focus:opacity-95 focus:transition-none"
                  title={t("schedule.hoverMenu.edit")}
                  onClick={
                    setEditPeriod
                      ? () => setEditPeriod({ show: true, day, schedulePeriod })
                      : undefined
                  }
                >
                  <MaterialIcon icon="edit" />
                </button>

                {/* Delete button */}
                <button
                  className="error pointer-events-auto p-1 text-xl
                    transition-[opacity] hover:opacity-95 hover:transition-none
                    focus:opacity-95 focus:transition-none"
                  title={t("schedule.hoverMenu.delete")}
                  onClick={
                    setDeletePeriod
                      ? () =>
                          setDeletePeriod({
                            show: true,
                            periodID: schedulePeriod.id || 0,
                          })
                      : undefined
                  }
                >
                  <MaterialIcon icon="delete" />
                </button>
              </div>

              {/* Drag handle */}
              {!isTouchDevice() && (
                <button
                  className="surface shadow pointer-events-auto absolute
                    top-1/2 left-0 w-fit -translate-x-1/2 -translate-y-1/2
                    cursor-move rounded-full p-1 text-xl"
                  title={t("schedule.hoverMenu.move")}
                  onMouseDown={() => setDragging(true)}
                >
                  <MaterialIcon icon="drag_indicator" />
                </button>
              )}

              {/* Resize handle */}
              <button
                className={`surface shadow pointer-events-auto absolute
                  left-full w-fit -translate-x-1/2 -translate-y-1/2
                  cursor-ew-resize rounded-full p-1 text-xl
                  transition-[opacity,top] ${
                    isTouchDevice() &&
                    schedulePeriod.duration < 2 &&
                    !disableTutorial
                      ? "top-0"
                      : "top-1/2"
                  }`}
                title={t("schedule.hoverMenu.extend")}
                onMouseDown={(e) => {
                  setDisableTutorial(false);
                  setListeningCursor(true);
                  setCursorStart({ x: e.clientX, y: e.clientY });
                  setCursor({ x: e.clientX, y: e.clientY });
                }}
              >
                <MaterialIcon icon="straighten" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {listeningCursor && (
          <>
            {/* Visual indicator */}
            <motion.div
              className="absolute top-0 left-0 h-14 rounded-md border-4
                border-tertiary transition-[width]"
              style={{
                width:
                  findNumPeriodsFromCursor(
                    schedulePeriod.duration,
                    cursorStart.x,
                    cursor.x
                  ) *
                    // Multiply no. of periods by a period’s pixel length
                    112 -
                  // Correct for 4px border (both sides)
                  8,
              }}
              initial={{ opacity: 0, borderWidth: 2 }}
              animate={{ opacity: 1, borderWidth: 4 }}
              exit={{ opacity: 0, borderWidth: 2 }}
              transition={transition(duration.short4, easing.standard)}
            />

            {/* Detection area */}
            <motion.div
              className={`absolute top-0 left-0 h-14 cursor-ew-resize
                rounded-md ${
                  isTouchDevice()
                    ? "border-tertiary-translucent-12 bg-tertiary-translucent-08 border-4"
                    : "opacity-0"
                }`}
              style={{ width: (10 - schedulePeriod.startTime + 1) * 112 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition(duration.short4, easing.standard)}
              onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
              onMouseUp={() => {
                // Show Indicator for 1 second after touch if touch device
                if (isTouchDevice())
                  setTimeout(() => {
                    setListeningCursor(false);
                    setDisableTutorial(true);
                  }, 1000);
                // Else, hide it immediately
                else setListeningCursor(false);

                // Send new duration to Supabase then re-fetch
                setTimeout(
                  async () => {
                    if (teacher && schedulePeriod.id && schedulePeriod.class) {
                      await editScheduleItemDuration(
                        supabase,
                        day,
                        {
                          ...schedulePeriod,
                          duration: findNumPeriodsFromCursor(
                            schedulePeriod.duration,
                            cursorStart.x,
                            cursor.x
                          ),
                        },
                        teacher?.id
                      );
                      if (toggleFetched) toggleFetched();
                    }
                  },
                  // Delay the fetch if touch device
                  isTouchDevice() ? 1000 : 0
                );
              }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PeriodHoverMenu;
