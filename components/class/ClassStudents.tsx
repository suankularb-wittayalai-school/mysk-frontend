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
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { Student } from "@/utils/types/person";
import LookupList from "../lookup/LookupList";
import { nameJoiner } from "@/utils/helpers/name";

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

  // Query
  const [query, setQuery] = useState<string>("");

  return (
    <SplitLayout
      ratio="list-detail"
      className="sm:[&>*>*]:!h-[calc(100vh-14.75rem-1px)]
        supports-[height:100dvh]:sm:[&>*>*]:!h-[calc(100dvh-14.75rem-1px)]"
    >
      <LookupList
        length={studentList.length}
        searchAlt="Search students"
        query={query}
        onQueryChange={setQuery}
        liveFilter
      >
        {studentList
          .filter(
            (student) =>
              String(student.classNo).includes(query) ||
              nameJoiner("th", student.name).toLowerCase().includes(query) ||
              nameJoiner("en-US", student.name).toLowerCase().includes(query)
          )
          .map((student) => (
            <ClassStudentCard
              key={student.id}
              seperated={query === ""}
              student={student}
              selectedID={selected}
              setSelectedID={setSelected}
            />
          ))}
      </LookupList>
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
