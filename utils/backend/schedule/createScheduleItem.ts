import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Teacher } from "@/utils/types/person";
import { PeriodContentItem } from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";
import { pick } from "radash";

export default async function createScheduleItem(
  supabase: DatabaseClient,
  scheduleItem: Required<
    Omit<PeriodContentItem, "id" | "subject" | "teachers" | "co_teachers">
  > & {
    day: number;
    subject: Pick<Subject, "id">;
    teachers: Pick<Teacher, "id">[];
    co_teachers: Pick<Teacher, "id">[];
  },
): Promise<BackendReturn<null>> {
  const { data, error } = await supabase
    .from("schedule_items")
    .insert({
      ...pick(scheduleItem, ["day", "start_time", "duration"]),
      subject_id: scheduleItem.subject.id,
      year: getCurrentAcademicYear(),
      semester: getCurrentSemester(),
    })
    .select("*")
    .limit(1)
    .order("id")
    .single();
  if (error) {
    logError("createScheduleItem (schedule_items)", error);
    return { data: null, error };
  }

  const { error: teachersError } = await supabase
    .from("schedule_item_teachers")
    .upsert(
      scheduleItem.teachers.map((teacher) => ({
        schedule_item_id: data!.id,
        teacher_id: teacher.id,
      })),
    );
  if (teachersError) {
    logError("createScheduleItem (schedule_item_teachers)", teachersError);
    return { data: null, error: teachersError };
  }

  const { error: classroomsError } = await supabase
    .from("schedule_item_classrooms")
    .upsert(
      scheduleItem.classrooms.map((classroom) => ({
        schedule_item_id: data!.id,
        classroom_id: classroom.id,
      })),
    );
  if (classroomsError) {
    logError("createScheduleItem (schedule_item_classrooms)", classroomsError);
    return { data: null, error: classroomsError };
  }

  const { error: roomsError } = await supabase
    .from("schedule_item_rooms")
    .upsert(
      scheduleItem.rooms.map((room) => ({ schedule_item_id: data!.id, room })),
    );
  if (roomsError) {
    logError("createScheduleItem (schedule_item_rooms)", roomsError);
    return { data: null, error: roomsError };
  }

  return { data: null, error };
}
