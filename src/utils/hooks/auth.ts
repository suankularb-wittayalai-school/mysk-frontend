// External libraries
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { User } from "@supabase/supabase-js";

// Backend
import { db2Teacher } from "@utils/backend/database";

// Types
import { Teacher } from "@utils/types/person";

export function useTeacherAccount(): [Teacher | null, User | null] {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (!user || user.user_metadata.role != "teacher") return;
    supabase
      .from("teacher")
      .select("*, person(*), subject_group(*)")
      .eq("id", user.user_metadata.teacher)
      .single()
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }

        db2Teacher(supabase, res.data).then((teacher) => setTeacher(teacher));
      });
  }, [user]);
  return [teacher, user];
}
