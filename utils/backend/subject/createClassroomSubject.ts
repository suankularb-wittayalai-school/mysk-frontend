import { logError } from "@/utils/helpers/debug";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { ClassroomSubject } from "@/utils/types/subject";

export async function createClassroomSubject(
  supabase: DatabaseClient,
  classroomSubject: ClassroomSubject,
): Promise<BackendReturn<null>> {
  const { data, error } = await supabase
    .from("classroom_subjects")
    .insert({
      classroom_id: classroomSubject.classroom.id,
      subject_id: classroomSubject.subject.id,
      ggc_code: classroomSubject.ggc_code,
      ggc_link: classroomSubject.ggc_link,
      gg_meet_link: classroomSubject.gg_meet_link,
    })
    .select()
    .limit(1)
    .order("id")
    .single();
  if (error) {
    logError("createClassroomSubject (classroom_subjects)", error);
    return { data: null, error };
  }

  const { error: teachersError } = await supabase
    .from("classroom_subject_teachers")
    .upsert(
      classroomSubject.teachers.map(({ id }) => ({
        classroom_subject_id: data!.id,
        teacher_id: id,
      })),
    );
  if (teachersError) {
    logError(
      "createClassroomSubject (classroom_subject_teachers)",
      teachersError,
    );
    return { data: null, error };
  }

  const { error: coTeachersError } = await supabase
    .from("classroom_subject_co_teachers")
    .upsert(
      classroomSubject.teachers.map(({ id }) => ({
        classroom_subject_id: data!.id,
        teacher_id: id,
      })),
    );
  if (teachersError) {
    logError(
      "createClassroomSubject (classroom_subject_co_teachers)",
      teachersError,
    );
    return { data: null, error };
  }

  return { data: null, error };
}
