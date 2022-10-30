// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";

// Components
import HoverList from "@components/HoverList";
import PeriodHoverMenu from "@components/schedule/PeriodHoverMenu";

// Helpers
import { getLocaleObj } from "@utils/helpers/i18n";

// Types
import { LangCode } from "@utils/types/common";
import { Role } from "@utils/types/person";
import {
  SchedulePeriod as SchedulePeriodType,
  PeriodContentItem,
} from "@utils/types/schedule";
import { Subject } from "@utils/types/subject";

const SubjectPeriod = ({
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

export default SubjectPeriod;
