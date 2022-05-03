import { supabase } from "@utils/supabaseClient";
import { useState, useEffect } from "react";
import { Teacher } from "@utils/types/person";
import { TeacherDB, TeacherTable } from "@utils/types/database/person";
import { db2Teacher } from "@utils/backend/database";

export function useTeacherOption(subjectGroupId: number) {
  const [teachers, setTeachers] = useState<Array<Teacher>>([]);

  useEffect(() => {
    supabase
      .from<TeacherDB>("teacher")
      .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
      .match({ subject_group: subjectGroupId })
      .then((res) => {
        if (res.error) {
          console.error(res.error);
        }
        // console.log(res.data);
        if (!res.data) {
          return [];
        }

        Promise.all(
          res.data.map(async (teacher: TeacherDB) => await db2Teacher(teacher))
        ).then((teachers) => {
          setTeachers(teachers);
        });
      });
  }, [subjectGroupId]);
  return teachers;
}
