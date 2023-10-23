// External libraries
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

// SK Components
import { ChipField, ChipSet, InputChip } from "@suankularb-components/react";

/**
 * A Chip Field for allergies.
 *
 * @param label Override the Chip Field label.
 * @param allergies An array of allergies, each represented by a string in Thai.
 * @param onChange Triggers when a Chip is added/removed.
 *
 * @returns A Chip Field.
 */
const AllergiesField: FC<{
  label?: string;
  allergies: string[];
  onChange: (value: string[]) => void;
}> = ({ label, allergies, onChange }) => {
  const { t } = useTranslation("account");

  const [allergyField, setAllergyField] = useState("");

  return (
    <ChipField
      label={label || t("profile.general.allergies")}
      helperMsg={ t("profile.general.allergies_helper")}
      value={allergyField}
      onChange={setAllergyField}
      onNewEntry={(value) => onChange([...allergies, value])}
      onDeleteLast={() => onChange(allergies.slice(0, -1))}
      entrySeparators={[",", ";"]}
    >
      <ChipSet>
        {allergies.map((allergy: string) => (
          <InputChip
            key={allergy}
            onDelete={() =>
              onChange(
                allergies.filter((mapAllergy: string) => allergy !== mapAllergy)
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
