import { getCurrentAcademicYear } from "@/utils/helpers/date";
import { logError } from "@/utils/helpers/debug";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import { ClassroomSubject } from "@/utils/types/subject";

export async function updateClassroomSubject(
  supabase: DatabaseClient,
  classroomSubject: Omit<ClassroomSubject, "classroom" | "subject"> & {
    classroom: Pick<Classroom, "number">;
    subject: Pick<Classroom, "id">;
  },
): Promise<BackendReturn<null>> {
  const { data: classroom, error: classroomError } = await supabase
    .from("classrooms")
    .select("id")
    .eq("number", classroomSubject.classroom.number)
    .eq("year", getCurrentAcademicYear())
    .limit(1)
    .single();
  if (classroomError) {
    logError(
      "createClassroomSubject (classroom_subject_teachers)",
      classroomError,
    );
    return { data: null, error: classroomError };
  }

  const { data, error } = await supabase
    .from("classroom_subjects")
    .update({
      classroom_id: classroom!.id,
      subject_id: classroomSubject.subject.id,
      ggc_code: classroomSubject.ggc_code,
      ggc_link: classroomSubject.ggc_link,
      gg_meet_link: classroomSubject.gg_meet_link,
    })
    .eq("id", classroomSubject.id)
    .select()
    .limit(1)
    .order("id")
    .single();
  if (error) {
    logError("updateClassroomSubject (classroom_subjects)", error);
    return { data: null, error };
  }

  // Clear join tables
  const { error: delTeachersError } = await supabase
    .from("classroom_subject_teachers")
    .delete()
    .eq("classroom_subject_id", data!.id);
  const { error: delCoTeachersError } = await supabase
    .from("classroom_subject_co_teachers")
    .delete()
    .eq("classroom_subject_id", data!.id);
  if (delTeachersError || delCoTeachersError) {
    logError(
      "updateClassroomSubject (clear join tables)",
      (delTeachersError || delCoTeachersError)!,
    );
    return { data: null, error: delTeachersError || delCoTeachersError };
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
      "updateClassroomSubject (classroom_subject_teachers)",
      teachersError,
    );
    return { data: null, error: teachersError };
  }

  if (classroomSubject.co_teachers?.length) {
    const { error: coTeachersError } = await supabase
      .from("classroom_subject_co_teachers")
      .upsert(
        classroomSubject.co_teachers.map(({ id }) => ({
          classroom_subject_id: data!.id,
          teacher_id: id,
        })),
      );
    if (coTeachersError) {
      logError(
        "createClassroomSubject (classroom_subject_co_teachers)",
        coTeachersError,
      );
      return { data: null, error: coTeachersError };
    }
  }

  return { data: null, error: null };
}
