// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { FC, useContext, useState } from "react";

// SK Components
import {
  ChipField,
  ChipSet,
  InputChip,
  Snackbar,
} from "@suankularb-components/react";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import { getClassWNumber } from "@/utils/backend/classroom/classroom";

// Helpers
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { ClassWNumber } from "@/utils/types/class";

const ClassesField: FC<{
  label?: string;
  classes: ClassWNumber[];
  onChange: (value: ClassWNumber[]) => void;
}> = ({ label, classes, onChange }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  // Supabase
  const supabase = useSupabaseClient();

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  // Form control
  const [classField, setClassField] = useState<string>("");

  // Loading
  const [loading, toggleLoading] = useToggle();

  return (
    <ChipField
      label={label || t("input.classesField.label")}
      placeholder={t("input.classesField.placeholder")}
      value={classField}
      onChange={setClassField}
      onNewEntry={(value) => {
        // Validate
        if (!value) return;
        if (!/^\d{3}$/.test(value)) {
          setSnackbar(
            <Snackbar>{t("input.classesField.snackbar.badFormat")}</Snackbar>
          );
          return;
        }

        // Ensure no duplicate
        if (classes.find((classItem) => Number(value) === classItem.number)) {
          setSnackbar(
            <Snackbar>{t("input.classesField.snackbar.duplicate")}</Snackbar>
          );
          return;
        }

        // Find class in database
        withLoading(
          async () => {
            const { data, error } = await getClassWNumber(
              supabase,
              Number(value)
            );

            // If class doesn’t exist, notify the user
            if (error) {
              console.error(error);
              setSnackbar(
                <Snackbar>{t("input.classesField.snackbar.notFound")}</Snackbar>
              );
              return false;
            }

            // Add class to list
            onChange([...classes, data!]);
            return true;
          },
          toggleLoading,
          { hasEndToggle: true }
        );
      }}
      onDeleteLast={() => onChange(classes.slice(0, -1))}
      loading={loading}
      locale={locale}
      className="sm:col-span-2"
    >
      <ChipSet>
        {classes.map((classItem) => (
          <InputChip
            key={classItem.id}
            onDelete={() =>
              onChange(
                classes.filter((mapClass) => classItem.id !== mapClass.id)
              )
            }
          >
            {t("class", { ns: "common", number: classItem.number })}
          </InputChip>
        ))}
      </ChipSet>
    </ChipField>
  );
};

export default ClassesField;
