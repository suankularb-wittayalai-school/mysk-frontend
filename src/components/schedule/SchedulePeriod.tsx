// Modules
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

// Components
import HoverList from "@components/HoverList";

// Animations
import { animationTransition } from "@utils/animations/config";

// Backend
import {
  editScheduleItemDuration,
  moveScheduleItem,
} from "@utils/backend/schedule/schedule";

// Helpers
import { isTouchDevice } from "@utils/helpers/browser";
import { getLocaleObj } from "@utils/helpers/i18n";
import { isInPeriod } from "@utils/helpers/schedule";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import { LangCode } from "@utils/types/common";
import { Role } from "@utils/types/person";
import {
  SchedulePeriod as SchedulePeriodType,
  PeriodContentItem,
} from "@utils/types/schedule";
import { Subject } from "@utils/types/subject";

// Empty Schedule Period
const EmptySchedulePeriod = ({
  isInSession,
  day,
  startTime,
  role,
  allowEdit,
  setAddPeriod,
  toggleFetched,
}: {
  isInSession: boolean;
  day: Day;
  startTime: number;
  role: Role;
  allowEdit?: boolean;
  setAddPeriod?: ({
    show,
    day,
    startTime,
  }: {
    show: boolean;
    day: Day;
    startTime: number;
  }) => void;
  toggleFetched?: () => void;
}): JSX.Element => {
  if (role == "teacher" && allowEdit)
    return (
      <AddableEmptySchedulePeriod
        isInSession={isInSession}
        day={day}
        startTime={startTime}
        setAddPeriod={setAddPeriod}
        toggleFetched={toggleFetched}
      />
    );
  else
    return (
      <div
        className={`h-[3.75rem] w-full rounded-lg ${
          isInSession ? "border-4 border-secondary" : "border-2 border-outline"
        }`}
      />
    );
};

const AddableEmptySchedulePeriod = ({
  isInSession,
  day,
  startTime,
  setAddPeriod,
  toggleFetched,
}: {
  isInSession: boolean;
  day: Day;
  startTime: number;
  setAddPeriod?: ({
    show,
    day,
    startTime,
  }: {
    show: boolean;
    day: Day;
    startTime: number;
  }) => void;
  toggleFetched?: () => void;
}): JSX.Element => {
  const { t } = useTranslation("schedule");
  const [processing, setProcessing] = useState<boolean>(false);
  const [teacher] = useTeacherAccount();

  return (
    <button
      className={`grid h-[3.75rem] w-full place-items-center rounded-lg text-4xl transition-[border-color]
         ${
           processing
             ? "border-4 border-secondary bg-secondary-translucent-12"
             : `group hover:border-primary hover:bg-primary-translucent-08
                focus:border-primary focus:bg-primary-translucent-12 ${
                  isInSession
                    ? "border-4 border-secondary"
                    : "border-2 border-outline"
                }`
         }`}
      title={t("schedule.hoverMenu.add")}
      onClick={
        setAddPeriod
          ? () => setAddPeriod({ show: true, day, startTime })
          : undefined
      }
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={async (e) => {
        setProcessing(true);
        if (teacher)
          await moveScheduleItem(
            day,
            {
              ...(JSON.parse(
                e.dataTransfer.getData("text")
              ) as PeriodContentItem),
              startTime,
            },
            teacher.id
          );
        e.dataTransfer.clearData();
        if (toggleFetched) toggleFetched();
      }}
    >
      <MaterialIcon
        icon="add"
        allowCustomSize
        className="scale-90 text-primary opacity-0 transition-all
          group-hover:scale-100 group-hover:opacity-100
          group-focus:scale-100 group-focus:opacity-100"
      />
    </button>
  );
};

// Multiple Schedule Period
const ElectivePeriod = ({ isInSession }: { isInSession: boolean }) => {
  const { t } = useTranslation("schedule");

  return (
    <button
      className={[
        `group relative h-[3.75rem] w-full rounded-lg
        text-left font-display text-xl font-medium leading-none
        before:absolute before:inset-0 before:rounded-xl
        before:transition-[background-color]
        hover:before:bg-on-primary-translucent-08 hover:before:transition-none`,
        isInSession
          ? "bg-tertiary-translucent-12 text-on-tertiary-container shadow"
          : "bg-primary-translucent-12 text-on-primary-container",
      ].join(" ")}
    >
      <div className="px-4 py-2 transition-[opacity]">
        <span>{t("schedule.elective")}</span>
      </div>
      <div
        className="pointer-events-none absolute top-0 z-30 h-full w-full
          rounded-lg border-2 border-primary bg-secondary-translucent-12
          opacity-0 transition-[opacity] group-hover:opacity-100
          group-focus:opacity-100"
      >
        <div
          className="primary pointer-events-auto absolute top-0 left-1/2
            -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface
            p-1 text-xl shadow transition-[opacity] hover:transition-none
            focus:opacity-95 focus:transition-none"
        >
          <MaterialIcon icon="open_in_full" allowCustomSize />
        </div>
      </div>
    </button>
  );
};

// Subject Schedule Period
const SubjectSchedulePeriod = ({
  isInSession,
  day,
  schedulePeriod,
  role,
  allowEdit,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
}: {
  isInSession: boolean;
  day: Day;
  schedulePeriod: PeriodContentItem;
  role: Role;
  allowEdit?: boolean;
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
}): JSX.Element => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as LangCode;

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);

  // Component-specific utils
  function getSubjectName(
    duration: SchedulePeriodType["duration"],
    subjectName: Subject["name"]
  ) {
    return duration < 2
      ? // If short period, use short name
        subjectName[locale]?.shortName ||
          subjectName.th.shortName ||
          // If no short name, use name
          subjectName[locale]?.name ||
          subjectName.th.name
      : // If long period, use name
        subjectName[locale]?.name || subjectName.th.name;
  }

  return (
    <div
      className={`relative h-[3.75rem] cursor-auto rounded-lg leading-snug ${
        isInSession ? "container-tertiary shadow" : "container-secondary"
      } ${showMenu ? "z-20" : ""}`}
      tabIndex={0}
      // Mouse support
      onMouseOver={() => setShowMenu(true)}
      onMouseOut={() => setShowMenu(false)}
      // Keyboard/touch support
      onFocus={() => setShowMenu(true)}
      onBlur={() => setShowMenu(false)}
      // Drag support
      draggable={dragging}
      onDragStart={(e) =>
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id: schedulePeriod.id,
            duration: schedulePeriod.duration,
            class: schedulePeriod.class,
          })
        )
      }
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "none";
        setDragging(false);
      }}
    >
      {role == "teacher" && allowEdit && (
        <PeriodHoverMenu
          show={showMenu}
          day={day}
          schedulePeriod={schedulePeriod}
          setEditPeriod={setEditPeriod}
          setDeletePeriod={setDeletePeriod}
          toggleFetched={toggleFetched}
          setDragging={setDragging}
        />
      )}
      <div className="flex flex-col px-4 py-2">
        {role == "teacher" ? (
          <>
            <span className="truncate font-display text-xl font-medium">
              {schedulePeriod.class &&
                t("class", { number: schedulePeriod.class.number })}
            </span>
            <span
              className="truncate text-base"
              title={getLocaleObj(schedulePeriod.subject.name, locale).name}
            >
              {getSubjectName(
                schedulePeriod.duration,
                schedulePeriod.subject.name
              )}
            </span>
          </>
        ) : (
          <>
            <span
              className="truncate font-display text-xl font-medium"
              title={getLocaleObj(schedulePeriod.subject.name, locale).name}
            >
              {getSubjectName(
                schedulePeriod.duration,
                schedulePeriod.subject.name
              )}
            </span>
            <HoverList people={schedulePeriod.subject.teachers} />
          </>
        )}
      </div>
    </div>
  );
};

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
  const { t } = useTranslation("schedule");
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
            className="pointer-events-none absolute z-30 h-full w-full rounded-lg
              border-2 border-primary bg-secondary-translucent-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={animationTransition}
          >
            <div className="relative h-full w-full">
              {/* Helper message */}
              {isTouchDevice() && !disableTutorial && (
                <motion.p
                  className="inverse-surface absolute bottom-1 left-1 flex h-6
                    w-fit items-center gap-1 whitespace-nowrap rounded-md px-2
                    font-sans font-medium shadow"
                  initial={{ scale: 0.9, y: 5, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 5, opacity: 0 }}
                  transition={animationTransition}
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
                className="absolute top-0 left-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 flex-row
                  gap-0.5 overflow-hidden rounded-full border-2 border-surface bg-surface shadow"
              >
                {/* Edit button */}
                <button
                  className="primary pointer-events-auto p-1 text-xl transition-[opacity]
                    hover:opacity-95 hover:transition-none focus:opacity-95 focus:transition-none"
                  title={t("schedule.hoverMenu.edit")}
                  onClick={
                    setEditPeriod
                      ? () => setEditPeriod({ show: true, day, schedulePeriod })
                      : undefined
                  }
                >
                  <MaterialIcon icon="edit" allowCustomSize />
                </button>

                {/* Delete button */}
                <button
                  className="error pointer-events-auto p-1 text-xl transition-[opacity]
                    hover:opacity-95 hover:transition-none focus:opacity-95 focus:transition-none"
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
                  <MaterialIcon icon="delete" allowCustomSize />
                </button>
              </div>

              {/* Drag handle */}
              {!isTouchDevice() && (
                <button
                  className="surface pointer-events-auto absolute top-1/2 left-0 w-fit -translate-x-1/2
                    -translate-y-1/2 cursor-move rounded-full p-1 text-xl shadow"
                  title={t("schedule.hoverMenu.move")}
                  onMouseDown={() => setDragging(true)}
                >
                  <MaterialIcon icon="drag_indicator" allowCustomSize />
                </button>
              )}

              {/* Resize handle */}
              <button
                className={`surface pointer-events-auto absolute left-full w-fit
                  -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full p-1 text-xl shadow
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
                <MaterialIcon icon="straighten" allowCustomSize />
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
              className="absolute top-0 left-0 h-[3.75rem] rounded-lg border-4 border-tertiary transition-[width]"
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
              transition={animationTransition}
            />

            {/* Detection area */}
            <motion.div
              className={`absolute top-0 left-0 h-[3.75rem] cursor-ew-resize rounded-lg ${
                isTouchDevice()
                  ? "border-4 border-tertiary-translucent-12 bg-tertiary-translucent-08"
                  : "opacity-0"
              }`}
              style={{ width: (10 - schedulePeriod.startTime + 1) * 112 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={animationTransition}
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

// Schedule Period
const SchedulePeriod = ({
  schedulePeriod,
  now,
  day,
  periodWidth,
  role,
  allowEdit,
  setAddPeriod,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
}: {
  schedulePeriod: SchedulePeriodType;
  now: Date;
  day: Date;
  periodWidth: number;
  role: Role;
  allowEdit?: boolean;
  setAddPeriod?: ({
    show,
    day,
    startTime,
  }: {
    show: boolean;
    day: Day;
    startTime: number;
  }) => void;
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
}): JSX.Element => {
  return (
    <motion.li
      key={
        schedulePeriod.content.length > 0
          ? `sp-${schedulePeriod.id}`
          : `sp-${day.getDay()}-${schedulePeriod.startTime}`
      }
      className="absolute px-1 transition-[width]"
      style={{
        width: periodWidth * schedulePeriod.duration,
        left: periodWidth * (schedulePeriod.startTime - 1),
      }}
      layoutId={
        schedulePeriod.content.length > 0
          ? `sp-${schedulePeriod.id}`
          : undefined
      }
      initial={{ scale: 0.8, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: 20, opacity: 0 }}
      transition={animationTransition}
    >
      {schedulePeriod.content.length > 1 ? (
        // Elective period
        <ElectivePeriod
          isInSession={isInPeriod(
            now,
            day,
            schedulePeriod.startTime,
            schedulePeriod.duration
          )}
        />
      ) : schedulePeriod.content.length == 1 ? (
        // Filled period
        <SubjectSchedulePeriod
          isInSession={isInPeriod(
            now,
            day,
            schedulePeriod.startTime,
            schedulePeriod.duration
          )}
          schedulePeriod={schedulePeriod.content[0]}
          day={day.getDay() as Day}
          role={role}
          allowEdit={allowEdit}
          setEditPeriod={setEditPeriod}
          setDeletePeriod={setDeletePeriod}
          toggleFetched={toggleFetched}
        />
      ) : (
        // Empty period
        <EmptySchedulePeriod
          isInSession={isInPeriod(
            now,
            day,
            schedulePeriod.startTime,
            schedulePeriod.duration
          )}
          day={day.getDay() as Day}
          startTime={schedulePeriod.startTime}
          role={role}
          allowEdit={allowEdit}
          setAddPeriod={setAddPeriod}
          toggleFetched={toggleFetched}
        />
      )}
    </motion.li>
  );
};

export default SchedulePeriod;
