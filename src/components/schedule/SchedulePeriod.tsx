// Modules
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

// Components
import HoverList from "@components/HoverList";

// Types
import { Role, Teacher } from "@utils/types/person";
import { SchedulePeriod as SchedulePeriodType } from "@utils/types/schedule";
import { Subject } from "@utils/types/subject";

// Animations
import { animationTransition } from "@utils/animations/config";

// Helpers
import { isInPeriod } from "@utils/helpers/schedule";
import { editScheduleItemDuration } from "@utils/backend/schedule/schedule";

// Empty Schedule Period
const EmptySchedulePeriod = ({
  isInSession,
  day,
  startTime,
  role,
  setAddPeriod,
}: {
  isInSession: boolean;
  day: Day;
  startTime: number;
  role: Role;
  setAddPeriod?: ({
    show,
    day,
    startTime,
  }: {
    show: boolean;
    day: Day;
    startTime: number;
  }) => void;
}): JSX.Element =>
  role == "teacher" ? (
    <button
      className={`group grid h-[3.75rem] w-full place-items-center rounded-lg text-4xl transition-[outline-color]
        hover:bg-primary-translucent-08 hover:outline-primary
        focus:bg-primary-translucent-12 focus:outline-primary ${
          isInSession
            ? "outline-4 outline-offset-[-4px] outline-secondary"
            : "outline-2 outline-offset-[-2px] outline-outline"
        }`}
      onClick={
        setAddPeriod
          ? () => setAddPeriod({ show: true, day, startTime })
          : undefined
      }
    >
      <MaterialIcon
        icon="add"
        allowCustomSize
        className="scale-90 text-primary opacity-0 transition-all
          group-hover:scale-100 group-hover:opacity-100
          group-focus:scale-100 group-focus:opacity-100"
      />
    </button>
  ) : (
    <div
      className={`h-[3.75rem] w-full rounded-lg ${
        isInSession
          ? "outline-4 outline-offset-[-4px] outline-secondary"
          : "outline-2 outline-offset-[-2px] outline-outline"
      }`}
    />
  );

// Subject Schedule Period
const SubjectSchedulePeriod = ({
  isInSession,
  day,
  schedulePeriod,
  role,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
}: {
  isInSession: boolean;
  day: Day;
  schedulePeriod: SchedulePeriodType;
  role: Role;
  setEditPeriod?: ({
    show,
    day,
    schedulePeriod,
  }: {
    show: boolean;
    day: Day;
    schedulePeriod: SchedulePeriodType;
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
  const locale = useRouter().locale as "en-US" | "th";

  const [showMenu, setShowMenu] = useState<boolean>(false);

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

  type MinifiedSubject = {
    name: Subject["name"];
    teachers: Teacher[];
    coTeachers?: Teacher[] | undefined;
  };

  return (
    <div
      className={`relative h-[3.75rem] rounded-lg leading-snug ${
        isInSession ? "container-tertiary shadow" : "container-secondary"
      } ${showMenu ? "z-20" : ""}`}
      tabIndex={0}
      // Mouse support
      onMouseOver={() => setShowMenu(true)}
      onMouseOut={() => setShowMenu(false)}
      // Keyboard/touch support
      onFocus={() => setShowMenu(true)}
      onBlur={() => setShowMenu(false)}
    >
      {role == "teacher" && (
        <PeriodHoverMenu
          show={showMenu}
          day={day}
          schedulePeriod={schedulePeriod}
          setEditPeriod={setEditPeriod}
          setDeletePeriod={setDeletePeriod}
          toggleFetched={toggleFetched}
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
              title={
                (schedulePeriod.subject as MinifiedSubject).name[locale]
                  ?.name ||
                (schedulePeriod.subject as MinifiedSubject).name.th.name
              }
            >
              {getSubjectName(
                schedulePeriod.duration,
                (schedulePeriod.subject as MinifiedSubject).name
              )}
            </span>
          </>
        ) : (
          <>
            <span
              className="truncate font-display text-xl font-medium"
              title={
                (schedulePeriod.subject as MinifiedSubject).name[locale]
                  ?.name ||
                (schedulePeriod.subject as MinifiedSubject).name.th.name
              }
            >
              {getSubjectName(
                schedulePeriod.duration,
                (schedulePeriod.subject as MinifiedSubject).name
              )}
            </span>
            <HoverList
              people={(schedulePeriod.subject as MinifiedSubject).teachers}
            />
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
  toggleFetched,
  setEditPeriod,
  setDeletePeriod,
}: {
  show: boolean;
  day: Day;
  schedulePeriod: SchedulePeriodType;
  setEditPeriod?: ({
    show,
    day,
    schedulePeriod,
  }: {
    show: boolean;
    day: Day;
    schedulePeriod: SchedulePeriodType;
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
  const [listeningCursor, setListeningCursor] = useState<boolean>(false);
  const [cursorStart, setCursorStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [show, setShow] = useState<boolean>(givenShow);

  useEffect(() => setShow(givenShow), [givenShow]);

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
              bg-secondary-translucent-12 outline-offset-0 outline-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={animationTransition}
          >
            <div className="relative h-full w-full">
              {/* Edit/delete group */}
              <div
                className="surface absolute top-0 left-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2
                  flex-row gap-0.5 overflow-hidden rounded-full"
              >
                {/* Edit button */}
                <button
                  className="primary pointer-events-auto p-1 text-xl shadow"
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
                  className="error pointer-events-auto p-1 text-xl shadow"
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
              <button
                className="surface pointer-events-auto absolute top-1/2 left-0 w-fit
                -translate-x-1/2 -translate-y-1/2 cursor-move rounded-full p-1 text-xl shadow"
              >
                <MaterialIcon icon="drag_indicator" allowCustomSize />
              </button>

              {/* Resize handle */}
              <button
                className="surface pointer-events-auto absolute top-1/2 left-full w-fit
                  -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full p-1 text-xl shadow"
                onMouseDown={(e) => {
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
            <div
              className="absolute top-0 left-0 h-[3.75rem] cursor-ew-resize rounded-lg bg-tertiary-translucent-12 sm:opacity-0"
              style={{ width: (10 - schedulePeriod.startTime + 1) * 112 }}
              onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
              onMouseUp={async () => {
                setListeningCursor(false);
                if (schedulePeriod.id) {
                  await editScheduleItemDuration(
                    findNumPeriodsFromCursor(
                      schedulePeriod.duration,
                      cursorStart.x,
                      cursor.x
                    ),
                    schedulePeriod.id
                  );
                  if (toggleFetched) toggleFetched();
                }
              }}
              onTouchEnd={(e) => {
                setCursor({
                  x: (e.touches[0] || e.changedTouches[0]).pageX,
                  y: (e.touches[0] || e.changedTouches[0]).pageY,
                });
                setTimeout(async () => {
                  setListeningCursor(false);
                  if (schedulePeriod.id) {
                    editScheduleItemDuration(
                      findNumPeriodsFromCursor(
                        schedulePeriod.duration,
                        cursorStart.x,
                        cursor.x
                      ),
                      schedulePeriod.id
                    );
                    if (toggleFetched) toggleFetched();
                  }
                }, 2000);
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
    schedulePeriod: SchedulePeriodType;
  }) => void;
  setDeletePeriod?: ({
    show,
    periodID,
  }: {
    show: boolean;
    periodID: number;
  }) => void;
  toggleFetched?: () => void;
}): JSX.Element => (
  <motion.li
    key={`${day.getDay()}-${schedulePeriod.startTime}`}
    className="absolute px-1 transition-[width]"
    style={{
      width: periodWidth * schedulePeriod.duration,
      left: periodWidth * (schedulePeriod.startTime - 1),
    }}
    initial={{ scale: 0.8, y: 20, opacity: 0 }}
    animate={{ scale: 1, y: 0, opacity: 1 }}
    exit={{ scale: 0.8, y: 20, opacity: 0 }}
    transition={animationTransition}
  >
    {schedulePeriod.subject ? (
      // Filled period
      <SubjectSchedulePeriod
        isInSession={isInPeriod(
          now,
          day,
          schedulePeriod.startTime,
          schedulePeriod.duration
        )}
        schedulePeriod={schedulePeriod}
        day={day.getDay() as Day}
        role={role}
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
        setAddPeriod={setAddPeriod}
      />
    )}
  </motion.li>
);

export default SchedulePeriod;
