import cn from "@/utils/helpers/cn";
import useToggle from "@/utils/helpers/useToggle";
import { AbsenceType, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  FilterChip,
  MaterialIcon,
  Menu,
  MenuItem,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Chip to toggle between a Student being late or on time.
 *
 * @param attendance The Student’s Attendance at assembly.
 * @param onChange Triggers when the Attendance is changed. Should update the Attendance state.
 */
const LateChip: StylableFC<{
  attendance: StudentAttendance["assembly"];
  onChange: (attendance: StudentAttendance["assembly"]) => void;
}> = ({ attendance, onChange, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "item.lateChip" });

  const late = attendance.absence_type === AbsenceType.late;
  const [menuOpen, toggleMenuOpen] = useToggle();

  /** `onChange` with the new Student Attendance. */
  function toggleLate() {
    onChange({
      ...attendance,
      ...(!late // If not late, then make late.
        ? { is_present: false, absence_type: AbsenceType.late }
        : // If late, then make present.
          { is_present: true, absence_type: null }),
    });
  }

  if (!(attendance.is_present || attendance.absence_type === AbsenceType.late))
    return null;

  return (
    <FilterChip
      selected={late}
      onClick={toggleLate}
      onMenuToggle={toggleMenuOpen}
      menu={
        <Menu open={menuOpen} density={-4} className="!left-auto !min-w-40">
          <MenuItem
            icon={<MaterialIcon icon="done" />}
            selected={!late}
            onClick={() => {
              if (late) toggleLate();
              toggleMenuOpen();
            }}
          >
            {t("onTime")}
          </MenuItem>
          <MenuItem
            icon={<MaterialIcon icon="alarm" />}
            selected={late}
            onClick={() => {
              if (!late) toggleLate();
              toggleMenuOpen();
            }}
          >
            {t("late")}
          </MenuItem>
        </Menu>
      }
      style={style}
      className={cn(
        String.raw`!pl-4 [&>.skc-filter-chip\_\_icon]:!hidden`,
        className,
      )}
    >
      {late ? t("late") : t("onTime")}
    </FilterChip>
  );
};

export default LateChip;
