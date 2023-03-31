// External libraries
import { useState, useEffect } from "react";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { User } from "@supabase/supabase-js";

// Backend
import { db2Teacher } from "@/utils/backend/database";

// Types
import { DatabaseClient } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";

export function useTeacherAccount(): [Teacher | null, User | null] {
  const user = useUser();
  const supabase = useSupabaseClient() as DatabaseClient;
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (!user || user.user_metadata.role != "teacher") return;
    (async () => {
      const { data, error } = await supabase
        .from("teacher")
        .select("*, person(*), subject_group(*)")
        .eq("id", user!.user_metadata.teacher)
        .single();

      if (error) {
        console.log(error);
        return;
      }

      db2Teacher(supabase, data).then((teacher) => setTeacher(teacher));
    })();
  }, [user]);
  return [teacher, user];
}
