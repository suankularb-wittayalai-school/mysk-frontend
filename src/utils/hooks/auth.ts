// External libraries
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import { useUser } from "@supabase/auth-helpers-react";
import { User } from "@supabase/supabase-js";

// Backend
import { db2Teacher } from "@utils/backend/database";

// Types
import { Teacher } from "@utils/types/person";
import { TeacherDB } from "@utils/types/database/person";

// Supabase
import { supabase } from "@utils/supabaseClient";

export function useTeacherAccount(): [Teacher | null, User | null] {
  const user = useUser();
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (!user || user.user_metadata.role != "teacher") return;
    supabase
      .from<TeacherDB>("teacher")
      .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
      .eq("id", user.user_metadata.teacher)
      .single()
      .then((res) => {
        if (res.error || !res.data) {
          console.log(res.error);
          return;
        }

        db2Teacher(res.data).then((teacher) => {
          setTeacher(teacher);
        });
      });
  }, [user]);
  return [teacher, user];
}
