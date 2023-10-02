// Imports
import ClassTeacherCard from "@/components/class/ClassTeacherCard";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import PersonDetails from "@/components/lookup/person/PersonDetails";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import { withLoading } from "@/utils/helpers/loading";
import { getLocaleString } from "@/utils/helpers/string";
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";
import { Teacher } from "@/utils/types/person";
import { SubjectGroupTeachers } from "@/utils/types/subject";
import { SplitLayout, Text, useBreakpoint } from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FC, useEffect, useState } from "react";

const ClassTeachers: FC<{
  teacherList: SubjectGroupTeachers[];
  classNumber?: number;
}> = ({ teacherList, classNumber }) => {
  const { atBreakpoint } = useBreakpoint();
  const locale = useLocale();

  // Selected Person
  const [selected, setSelected] = useState(teacherList[0]?.teachers[0]?.id);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>();
  useEffect(() => {
    if (
      !selected ||
      selected === selectedTeacher?.id ||
      atBreakpoint === "base"
    )
      return;

    withLoading(
      async () => {
        const { data, error } = await getTeacherByID(supabase, selected, {
          detailed: true,
        });
        if (error) return false;

        setSelectedTeacher(data);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, [selected, atBreakpoint === "base"]);

  return (
    <SplitLayout
      ratio="list-detail"
      className="sm:[&>*>*]:!h-[calc(100dvh-8.25rem-1px)]"
    >
      <aside className="!flex flex-col gap-6">
        {teacherList.map((section) => (
          <section
            key={section.subject_group.id}
            className="flex flex-col gap-2"
          >
            <Text type="headline-small" element="h3">
              {getLocaleString(section.subject_group.name, locale)}
            </Text>
            {section.teachers.map((teacher) => (
              <ClassTeacherCard
                key={teacher.id}
                teacher={teacher}
                classNumber={classNumber}
                selectedID={selected}
                setSelectedID={setSelected}
              />
            ))}
          </section>
        ))}
      </aside>
      {selectedTeacher ? (
        <PersonDetails
          person={selectedTeacher}
          suggestionsType="share-only"
          loading={loading}
        />
      ) : (
        <EmptyDetail />
      )}
    </SplitLayout>
  );
};

export default ClassTeachers;
