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
  value: AbsenceType | null;
  onChange: (value: AbsenceType) => void;
}> = ({ value, onChange, style, className }) => {
  const { t } = useTranslation("lookup", {
    keyPrefix: "classes.dialog.attendance.item.absenceType",
  });

  return (
    <ChipSet scrollable style={style} className={className}>
      <FilterChip selected={value === "sick"} onClick={() => onChange("sick")}>
        {t("sick")}
      </FilterChip>
      <FilterChip
        selected={value === "business"}
        onClick={() => onChange("business")}
      >
        {t("business")}
      </FilterChip>
      <FilterChip
        selected={value === "activity"}
        onClick={() => onChange("activity")}
      >
        {t("activity")}
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
