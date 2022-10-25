// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { BackendReturn } from "@utils/types/common";
import { SubjectGroup } from "@utils/types/subject";

export async function getSubjectGroups(): Promise<
  BackendReturn<SubjectGroup[]>
> {
  const { data, error } = await supabase.from("SubjectGroup").select("*");
  if (error) return { data: [], error };
  return {
    data: data.map((subjectGroup) => ({
      id: subjectGroup.id,
      name: { th: subjectGroup.name_th, "en-US": subjectGroup.name_en },
    })),
    error: null,
  };
}
