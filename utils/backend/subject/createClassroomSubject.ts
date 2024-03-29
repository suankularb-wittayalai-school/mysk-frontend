import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import { ClassroomSubject } from "@/utils/types/subject";

/**
 * Create a connection between a Classroom and a Subject for the current
 * semester and academic year.
 *
 * @param supabase The Supabase client to use.
 * @param classroomSubject The Classroom Subject to create.
 *
 * @returns A Backend Return.
 */
export async function createClassroomSubject(
  supabase: DatabaseClient,
  classroomSubject: Omit<ClassroomSubject, "id" | "classroom" | "subject"> & {
    classroom: Pick<Classroom, "number">;
    subject: Pick<Classroom, "id">;
  },
): Promise<BackendReturn> {
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
    .insert({
      classroom_id: classroom!.id,
      subject_id: classroomSubject.subject.id,
      ggc_code: classroomSubject.ggc_code,
      ggc_link: classroomSubject.ggc_link,
      gg_meet_link: classroomSubject.gg_meet_link,
      semester: getCurrentSemester(),
      year: getCurrentAcademicYear(),
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
