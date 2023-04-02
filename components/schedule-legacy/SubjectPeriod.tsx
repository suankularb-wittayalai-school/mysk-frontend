// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";

// Internal components
import PeriodHoverMenu from "@/components/schedule-legacy/PeriodHoverMenu";

// Helpers
import { getLocaleObj } from "@/utils/helpers/i18n";

// Types
import { LangCode } from "@/utils/types/common";
import { Role } from "@/utils/types/person";
import {
  SchedulePeriod as SchedulePeriodType,
  PeriodContentItem,
} from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";
import HoverList from "../person/HoverList";

const SubjectPeriod = ({
  isInSession,
  day,
  schedulePeriod,
  role,
  allowEdit,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
  className,
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
  className?: string;
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
      className={[
        "relative h-14 cursor-auto overflow-x-hidden rounded-sm leading-snug",
        isInSession
          ? "shadow bg-tertiary-container text-on-tertiary-container"
          : "bg-secondary-container text-on-secondary-container",
        showMenu ? "z-20" : null,
        className,
      ]
        .filter((className) => className)
        .join(" ")}
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
      <div className="flex flex-col whitespace-nowrap px-4 py-2">
        {role == "teacher" ? (
          <>
            <span className="skc-title-medium truncate font-medium">
              {schedulePeriod.class &&
                t("class", { number: schedulePeriod.class.number })}
            </span>
            <span
              className="skc-body-small truncate"
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
              className="skc-title-medium truncate font-medium"
              title={getLocaleObj(schedulePeriod.subject.name, locale).name}
            >
              {getSubjectName(
                schedulePeriod.duration,
                schedulePeriod.subject.name
              )}
            </span>
            <span className="skc-body-small">
              <HoverList people={schedulePeriod.subject.teachers} />
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default SubjectPeriod;
