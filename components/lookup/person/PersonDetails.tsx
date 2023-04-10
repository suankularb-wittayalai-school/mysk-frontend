// External libraries
import { FC, useEffect, useState } from "react";

// SK Components
import { Card, Progress } from "@suankularb-components/react";

// Internal components
import PersonHeader from "./PersonHeader";
import { Role, Student, Teacher } from "@/utils/types/person";
import { getStudent } from "@/utils/backend/person/student";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getTeacher } from "@/utils/backend/person/teacher";
import { useToggle } from "@/utils/hooks/toggle";
import { withLoading } from "@/utils/helpers/loading";
import PersonDetailsContent from "./PersonDetailsContent";

const PersonDetails: FC<{ selected: { id: number; role: Role } }> = ({
  selected,
}) => {
  const supabase = useSupabaseClient();
  const [person, setPerson] = useState<Student | Teacher>();

  const [loading, toggleLoading] = useToggle();
  useEffect(() => {
    withLoading(
      async () => {
        let person: Student | Teacher | undefined;

        // If a Student is selected
        if (selected.role === "student") {
          const { data: student, error } = await getStudent(
            supabase,
            selected.id
          );
          if (error) return false;
          person = student;
        }

        // If a Teacher is selected
        else if (selected.role === "teacher") {
          const { data: teacher, error } = await getTeacher(
            supabase,
            selected.id
          );
          if (error) return false;
          person = teacher;
        }

        setPerson(person);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [selected]);

  return (
    <main className="hidden sm:block">
      <Card appearance="outlined" className="relative h-full overflow-hidden">
        <PersonHeader {...{ person }} />
        <Progress
          appearance="linear"
          alt="Loading person details…"
          visible={loading}
          className="sticky -mb-1"
        />
        {person && <PersonDetailsContent {...{ person }} />}
      </Card>
    </main>
  );
};

export default PersonDetails;
