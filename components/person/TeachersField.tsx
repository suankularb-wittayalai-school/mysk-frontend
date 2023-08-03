// Imports
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { FC, useContext, useState } from "react";
import {
  ChipField,
  ChipSet,
  InputChip,
  Snackbar,
} from "@suankularb-components/react";
import DynamicAvatar from "@/components/common/DynamicAvatar";
import SnackbarContext from "@/contexts/SnackbarContext";
import { withLoading } from "@/utils/helpers/loading";
import { getLocaleName } from "@/utils/helpers/string";
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";
import { Teacher } from "@/utils/types/person";
import getTeachersByFirstName from "@/utils/backend/person/getTeacherByFirstName";

const TeachersField: FC<{
  label?: string;
  teachers: Pick<Teacher, "id" | "first_name" | "last_name" | "profile">[];
  onChange: (
    value: Pick<Teacher, "id" | "first_name" | "last_name" | "profile">[],
  ) => void;
}> = ({ label, teachers, onChange }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  // Supabase
  const supabase = useSupabaseClient();

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  // Form control
  const [teacherField, setTeacherField] = useState<string>("");

  // Loading
  const [loading, toggleLoading] = useToggle();

  return (
    <ChipField
      label={label || t("input.teachersField.label")}
      placeholder={t("input.teachersField.placeholder")}
      value={teacherField}
      onChange={setTeacherField}
      onNewEntry={(value) => {
        // Validate
        if (!value) return;

        // Ensure no duplicate
        if (
          teachers.find((teacher) =>
            [
              teacher.first_name.th,
              teacher.first_name["en-US"]?.toLowerCase(),
            ].includes(value.toLowerCase()),
          )
        ) {
          setSnackbar(
            <Snackbar>{t("input.teachersField.snackbar.duplicate")}</Snackbar>,
          );
          return;
        }

        // Find teachers in database
        withLoading(
          async () => {
            const { data, error } = await getTeachersByFirstName(
              supabase,
              value,
            );

            // If no teachers match, notify the user
            if (error) {
              console.error(error);
              setSnackbar(
                <Snackbar>
                  {t("input.teachersField.snackbar.notFound")}
                </Snackbar>,
              );
              return false;
            }

            // Add teachers to list
            onChange([...teachers, ...data!]);
            return true;
          },
          toggleLoading,
          { hasEndToggle: true },
        );
      }}
      onDeleteLast={() => onChange(teachers.slice(0, -1))}
      loading={loading}
      locale={locale}
    >
      <ChipSet>
        {teachers.map((teacher) => (
          <InputChip
            key={teacher.id}
            avatar={<DynamicAvatar profile={teacher.profile} />}
            onDelete={() =>
              onChange(
                teachers.filter((mapTeacher) => teacher.id !== mapTeacher.id),
              )
            }
          >
            {getLocaleName(locale, teacher, {
              middleName: false,
              lastName: "abbr",
            })}
          </InputChip>
        ))}
      </ChipSet>
    </ChipField>
  );
};

export default TeachersField;
