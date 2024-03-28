import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { ClassroomSubject } from "@/utils/types/subject";

export default async function getClassroomSubjectsOfClass(
  supabase: DatabaseClient,
  classID: string,
  options?: { academicYear: number; semester: number },
): Promise<BackendReturn<ClassroomSubject[]>> {
  const { data: classroomSubjects, error: classroomSubjectsError } =
    await supabase
      .from("classroom_subjects")
      .select(
        `id,
        subjects(id, name_en, name_th, code_en, code_th),
        classrooms(id, number),
        classroom_subject_teachers(
          teachers(
            id, people(first_name_th, last_name_th, first_name_en, last_name_en)
          )
        ),
        classroom_subject_co_teachers(
          teachers(
            id, people(first_name_th, last_name_th, first_name_en, last_name_en)
          )
        ),
        ggc_code,
        ggc_link,
        gg_meet_link`,
      )
      .eq("classroom_id", classID)
      .eq("year", options?.academicYear || getCurrentAcademicYear())
      .eq("semester", options?.semester || getCurrentSemester());

  if (classroomSubjectsError) {
    logError("getClassroomSubjectsLists", classroomSubjectsError);
    return { error: classroomSubjectsError, data: null };
  }

  return {
    error: null,
    data: classroomSubjects.map((classroomSubject) => ({
      id: classroomSubject.id,
      subject: {
        id: classroomSubject.subjects?.id ?? "",
        name: mergeDBLocales(classroomSubject.subjects, "name"),
        code: mergeDBLocales(classroomSubject.subjects, "code"),
      },
      classroom: {
        id: classroomSubject.classrooms?.id ?? "",
        number: classroomSubject.classrooms?.number ?? 0,
      },
      teachers: classroomSubject.classroom_subject_teachers?.map(
        (classroomSubjectTeacher) => ({
          id: classroomSubjectTeacher.teachers?.id ?? "",
          first_name: mergeDBLocales(
            classroomSubjectTeacher.teachers?.people || null,
            "first_name",
          ),
          last_name: mergeDBLocales(
            classroomSubjectTeacher.teachers?.people || null,
            "last_name",
          ),
        }),
      ),
      co_teachers: classroomSubject.classroom_subject_co_teachers?.map(
        (classroomSubjectCoTeacher) => ({
          id: classroomSubjectCoTeacher.teachers?.id ?? "",
          first_name: mergeDBLocales(
            classroomSubjectCoTeacher.teachers?.people || null,
            "first_name",
          ),
          last_name: mergeDBLocales(
            classroomSubjectCoTeacher.teachers?.people || null,
            "last_name",
          ),
        }),
      ),
      ggc_code: classroomSubject.ggc_code,
      ggc_link: classroomSubject.ggc_link,
      gg_meet_link: classroomSubject.gg_meet_link,
    })),
  };
}
