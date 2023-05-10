import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SubjectGroup } from "@/utils/types/subject";
import { useState, useEffect } from "react";

export function useSubjectGroupOption() {
  const supabase = useSupabaseClient();
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);

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
