// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FC, useEffect, useState } from "react";

// SK Components
import { SplitLayout } from "@suankularb-components/react";

// Internal components
import ClassStudentCard from "@/components/class/ClassStudentCard";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import PersonDetails from "@/components/lookup/person/PersonDetails";

// Backend
import { getStudent } from "@/utils/backend/person/student";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { Student } from "@/utils/types/person";

const ClassStudents: FC<{
  studentList: Student[];
}> = ({ studentList }) => {
  // Selected Person
  const [selected, setSelected] = useState(studentList[0]?.id);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  const [selectedStudent, setSelectedStudent] = useState<Student>();
  useEffect(() => {
    if (!selected) return;

    withLoading(
      async () => {
        const { data, error } = await getStudent(supabase, selected);
        if (error) return false;

        setSelectedStudent(data);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [selected]);

  return (
    <SplitLayout
      ratio="list-detail"
      className="sm:[&>*>*]:!h-[calc(100vh-14.75rem-1px)]
        supports-[height:100dvh]:sm:[&>*>*]:!h-[calc(100dvh-14.75rem-1px)]"
    >
      <aside className="!px-0 sm:!pr-3">
        <ul className="!flex flex-col gap-2">
          {studentList.map((student) => (
            <ClassStudentCard
              key={student.id}
              student={student}
              selectedID={selected}
              setSelectedID={setSelected}
            />
          ))}
        </ul>
      </aside>
      {selected ? (
        <PersonDetails
          person={selectedStudent}
          suggestionsType="share-only"
          loading={loading}
        />
      ) : (
        <EmptyDetail />
      )}
    </SplitLayout>
  );
};

export default ClassStudents;
