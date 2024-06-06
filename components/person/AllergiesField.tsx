import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { ChipField, ChipSet, InputChip } from "@suankularb-components/react";
import { StylableFC } from "@/utils/types/common";

/**
 * A Chip Field for allergies.
 *
 * @param label Override the Chip Field label.
 * @param allergies An array of allergies, each represented by a string in Thai.
 * @param onChange Triggers when a Chip is added/removed.
 *
 * @returns A Chip Field.
 */
const AllergiesField: StylableFC<{
  label?: string;
  allergies: string[];
  onChange: (value: string[]) => void;
}> = ({ label, allergies, onChange, style, className }) => {
  const { t } = useTranslation("account/about");

  const [allergyField, setAllergyField] = useState("");

  return (
    <ChipField
      label={label || t("general.allergies")}
      helperMsg={t("general.allergies_helper")}
      value={allergyField}
      onChange={setAllergyField}
      onNewEntry={(value) => onChange([...allergies, value])}
      onDeleteLast={() => onChange(allergies.slice(0, -1))}
      entrySeparators={[",", ";"]}
      style={style}
      className={className}
    >
      <ChipSet>
        {allergies.map((allergy: string) => (
          <InputChip
            key={allergy}
            onDelete={() =>
              onChange(
                allergies.filter(
                  (mapAllergy: string) => allergy !== mapAllergy,
                ),
              )
            }
          >
            {allergy}
          </InputChip>
        ))}
      </ChipSet>
    </ChipField>
  );
};

export default AllergiesField;
