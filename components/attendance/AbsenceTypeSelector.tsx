// Imports
import { AbsenceType } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { ChipSet, FilterChip } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Chip Set for selecting an Absence Type.
 *
 * @param value The currently selected Absence Type.
 * @param onChange Callback function to handle changes to the Absence Type.
 */
const AbsenceTypeSelector: StylableFC<{
  value: Exclude<AbsenceType, "late"> | null;
  onChange: (value: AbsenceType) => void;
}> = ({ value, onChange, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "item.absenceType" });

  return (
    <ChipSet scrollable style={style} className={className}>
      <FilterChip
        selected={value === "on_leave"}
        onClick={() => onChange("on_leave")}
      >
        {t("onLeave")}
      </FilterChip>
      <FilterChip
        selected={value === "absent"}
        onClick={() => onChange("absent")}
      >
        {t("absent")}
      </FilterChip>
      <FilterChip
        selected={value === "dropped"}
        onClick={() => onChange("dropped")}
      >
        {t("dropped")}
      </FilterChip>
      <FilterChip
        selected={value === "other"}
        onClick={() => onChange("other")}
      >
        {t("other")}
      </FilterChip>
    </ChipSet>
  );
};

export default AbsenceTypeSelector;
