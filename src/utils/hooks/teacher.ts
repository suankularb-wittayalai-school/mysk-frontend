// External libraries
import { useEffect, useState } from "react";

// Backend
import { db2Teacher } from "@utils/backend/database";

// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { Teacher } from "@utils/types/person";

export function useTeacherOption(subjectGroupId: number) {
  const [teachers, setTeachers] = useState<Array<Teacher>>([]);

  useEffect(() => {
    supabase
      .from("teacher")
      .select("*, person(*), subject_group(*)")
      .match({ subject_group: subjectGroupId })
      .then((res) => {
        if (res.error) {
          console.error(res.error);
        }
        // console.log(res.data);
        if (!res.data) {
          return [];
        }

        Promise.all(res.data.map(db2Teacher)).then((teachers) => {
          setTeachers(teachers);
        });
      });
  }, [subjectGroupId]);
  return teachers;
}
