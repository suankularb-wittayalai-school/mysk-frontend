// External libraries
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// Backend
import { db2Teacher } from "@utils/backend/database";

// Helpers
import { getLocaleObj } from "@utils/helpers/i18n";

// Types
import { LangCode } from "@utils/types/common";
import { PersonName, Teacher } from "@utils/types/person";

export function useTeacherOptions(subjectGroupID: number) {
  const supabase = useSupabaseClient();
  const locale = useRouter().locale as LangCode;

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    supabase
      .from("teacher")
      .select("*, person(*), subject_group(*)")
      .match({ subject_group: subjectGroupID })
      .then((res) => {
        if (res.error) {
          console.error(res.error);
        }
        // console.log(res.data);
        if (!res.data) return [];

        Promise.all(
          res.data.map(async (teacher) => await db2Teacher(supabase, teacher))
        ).then((teachers) => {
          setTeachers(
            teachers.sort((a, b) => {
              const aName = (getLocaleObj(a.name, locale) as PersonName)
                .firstName;
              const bName = (getLocaleObj(b.name, locale) as PersonName)
                .firstName;
              return aName < bName ? -1 : aName > bName ? 1 : 0;
            })
          );
        });
      });
  }, [subjectGroupID]);

  return teachers;
}
