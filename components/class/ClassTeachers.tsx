// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FC, useEffect, useState } from "react";

// SK Components
import { SplitLayout } from "@suankularb-components/react";

// Internal components
import ClassTeacherCard from "@/components/class/ClassTeacberCard";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import PersonDetails from "@/components/lookup/person/PersonDetails";

// Backend
import { getTeacher } from "@/utils/backend/person/teacher";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { ClassTeachersListSection } from "@/utils/types/class";
import { Teacher } from "@/utils/types/person";

const ClassTeachers: FC<{
  teacherList: ClassTeachersListSection[];
}> = ({ teacherList }) => {
  const locale = useLocale();

  // Selected Person
  const [selected, setSelected] = useState(teacherList[0]?.teachers[0]?.id);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>();
  useEffect(() => {
    if (!selected) return;

    withLoading(
      async () => {
        const { data, error } = await getTeacher(supabase, selected);
        if (error) return false;

        setSelectedTeacher(data);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [selected]);

  return (
    <SplitLayout ratio="list-detail">
      <aside className="!flex flex-col gap-6">
        {teacherList.map((section) => (
          <section
            key={section.subjectGroup.id}
            className="flex flex-col gap-2"
          >
            <h3 className="skc-headline-small">
              {getLocaleString(section.subjectGroup.name, locale)}
            </h3>
            {section.teachers.map((teacher) => (
              <ClassTeacherCard
                key={teacher.id}
                teacher={teacher}
                selectedID={selected}
                setSelectedID={setSelected}
              />
            ))}
          </section>
        ))}
      </aside>
      {selected ? (
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
