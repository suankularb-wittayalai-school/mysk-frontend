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
  value: Exclude<AbsenceType, AbsenceType.late> | null;
  onChange: (value: AbsenceType) => void;
}> = ({ value, onChange, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "item.absenceType" });

  return (
    <ChipSet scrollable style={style} className={className}>
      <FilterChip
        selected={value === AbsenceType.sick}
        onClick={() => onChange(AbsenceType.sick)}
      >
        {t("sick")}
      </FilterChip>
      <FilterChip
        selected={value === AbsenceType.business}
        onClick={() => onChange(AbsenceType.business)}
      >
        {t("business")}
      </FilterChip>
      <FilterChip
        selected={value === AbsenceType.absent}
        onClick={() => onChange(AbsenceType.absent)}
      >
        {t("absent")}
      </FilterChip>
      <FilterChip
        selected={value === AbsenceType.dropped}
        onClick={() => onChange(AbsenceType.dropped)}
      >
        {t("dropped")}
      </FilterChip>
      <FilterChip
        selected={value === AbsenceType.other}
        onClick={() => onChange(AbsenceType.other)}
      >
        {t("other")}
      </FilterChip>
    </ChipSet>
  );
};

export default AbsenceTypeSelector;
