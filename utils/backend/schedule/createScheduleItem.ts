import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Teacher } from "@/utils/types/person";
import { PeriodContentItem } from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";
import { pick } from "radash";

export default async function createScheduleItem(
  supabase: DatabaseClient,
  scheduleItem: Omit<PeriodContentItem, "id" | "subject" | "teachers"> & {
    day: number;
    subject: Pick<Subject, "id">;
    teachers: Pick<Teacher, "id">[];
  },
): Promise<BackendReturn<null>> {
  const { data, error } = await supabase.from("schedule_items").insert({
    ...pick(scheduleItem, ["day", "start_time", "duration"]),
    semester: getCurrentSemester(),
    year: getCurrentAcademicYear(),
  });

  return { data: null, error };
}
