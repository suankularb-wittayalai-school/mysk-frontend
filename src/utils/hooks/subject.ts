import { supabase } from "@utils/supabase-client";
import { SubjectGroup } from "@utils/types/subject";
import { useState, useEffect } from "react";

export function useSubjectGroupOption() {
  const [subjectGroups, setSubjectGroups] = useState<Array<SubjectGroup>>([]);

  useEffect(() => {
    supabase
      .from("SubjectGroup")
      .select("*")
      .then((res: any) => {
        if (res.error) {
          console.error(res.error);
        }

        if (!res.data) {
          return;
        }

        let data = res.data.map(
          (group: { id: number; name_th: string; name_en: string }) => {
            return {
              id: group.id,
              name: { th: group.name_th, "en-US": group.name_en },
            };
          }
        );
        setSubjectGroups(data);
      });
  }, []);
  return subjectGroups;
}
