import { logError } from "@/utils/helpers/debug";
import { DatabaseClient, BackendReturn } from "@/utils/types/backend";
import { SubjectGroup } from "@/utils/types/subject";

export default async function getSubjectGroups(
  supabase: DatabaseClient,
): Promise<BackendReturn<SubjectGroup[]>> {
  const { data: fetchedSubjectGroups, error } = await supabase
    .from("subject_groups")
    .select("*");

  if (!fetchedSubjectGroups) {
    return {
      data: null,
      error: error,
    };
  }

  const subjectGroups = fetchedSubjectGroups.map((sg) => ({
    id: sg.id,
    name: {
      th: sg.name_th,
      "en-US": sg.name_en,
    },
  }));

  return {
    data: subjectGroups,
    error: null,
  };
}
