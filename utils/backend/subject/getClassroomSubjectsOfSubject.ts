import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { ClassroomSubject } from "@/utils/types/subject";

export default async function getClassroomSubjectsOfSubject(
  supabase: DatabaseClient,
  subjectID: string,
  options?: { academicYear: number; semester: number },
): Promise<BackendReturn<ClassroomSubject[]>> {
  const { data: classroomSubjects, error: classroomSubjectsError } =
    await supabase
      .from("classroom_subjects")
      .select(
        `id,
        classrooms(id, number),
        classroom_subject_teachers(
          teachers(
            id,
            people(first_name_th, last_name_th, first_name_en, last_name_en)
          )
        ),
        classroom_subject_co_teachers(
          teachers(
            id,
            people(first_name_th, last_name_th, first_name_en, last_name_en)
          )
        ),
        subjects(id, name_th, name_en, code_th, code_en),
        ggc_code,
        ggc_link,
        gg_meet_link`,
      )
      .eq("subject_id", subjectID)
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
        id: subjectID,
        name: mergeDBLocales(classroomSubject.subjects, "name"),
        code: mergeDBLocales(classroomSubject.subjects, "code"),
      },
      classroom: classroomSubject.classrooms!,
      teachers: classroomSubject.classroom_subject_teachers?.map(
        ({ teachers }) => ({
          id: teachers!.id,
          first_name: mergeDBLocales(teachers!.people, "first_name"),
          last_name: mergeDBLocales(teachers!.people, "last_name"),
        }),
      ),
      co_teachers: classroomSubject.classroom_subject_co_teachers?.map(
        ({ teachers }) => ({
          id: teachers!.id,
          first_name: mergeDBLocales(teachers!.people, "first_name"),
          last_name: mergeDBLocales(teachers!.people, "last_name"),
        }),
      ),
      ggc_code: classroomSubject.ggc_code,
      ggc_link: classroomSubject.ggc_link,
      gg_meet_link: classroomSubject.gg_meet_link,
    })),
  };
}
