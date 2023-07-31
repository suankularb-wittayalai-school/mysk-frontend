// Imports
import SnackbarContext from "@/contexts/SnackbarContext";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import { withLoading } from "@/utils/helpers/loading";
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";
import { classRegex } from "@/utils/patterns";
import { Classroom } from "@/utils/types/classroom";
import {
  ChipField,
  ChipSet,
  InputChip,
  Snackbar,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { FC, useContext, useEffect, useState } from "react";

const ClassroomsField: FC<{
  label?: string;
  classrooms: Pick<Classroom, "id" | "number">[];
  onChange: (value: Pick<Classroom, "id" | "number">[]) => void;
}> = ({ label, classrooms, onChange }) => {
  const locale = useLocale();
  const { t } = useTranslation("common", { keyPrefix: "input.classesField" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  const [field, setField] = useState("");
  useEffect(() => {
    // Validate and ensure no duplicate
    if (!classRegex.test(field)) return;
    if (classrooms.find((classroom) => field === String(classroom.number)))
      return;

    // Find class in database
    withLoading(
      async () => {
        const { data, error } = await getClassroomByNumber(
          supabase,
          Number(field),
        );

        // If class doesn’t exist, notify the user
        if (error) {
          console.error(error);
          setSnackbar(<Snackbar>{t("snackbar.notFound")}</Snackbar>);
          return false;
        }

        // Add class to list
        onChange([...classrooms, data!]);

        setField("");
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, [field]);

  return (
    <ChipField
      label={label || t("label")}
      placeholder={t("placeholder")}
      value={field}
      onChange={setField}
      onDeleteLast={() => onChange(classrooms.slice(0, -1))}
      loading={loading}
      locale={locale}
      className="sm:col-span-2"
    >
      <ChipSet>
        {classrooms.map((classItem) => (
          <InputChip
            key={classItem.id}
            onDelete={() =>
              onChange(
                classrooms.filter((mapClass) => classItem.id !== mapClass.id),
              )
            }
          >
            {tx("class", { number: classItem.number })}
          </InputChip>
        ))}
      </ChipSet>
    </ChipField>
  );
};

export default ClassroomsField;
