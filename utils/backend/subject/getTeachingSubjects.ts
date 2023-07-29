import { logError } from "@/utils/helpers/debug";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Subject, SubjectClassrooms } from "@/utils/types/subject";
import { getCurrentAcademicYear, getCurrentSemester } from "@/utils/helpers/date";

export default async function getTeachingSubject(
    supabase: DatabaseClient,
    teacherID: string,
    options?: { academicYear: number, semester: number },
  ): Promise<BackendReturn<SubjectClassrooms[]>> {
    const { data: classroomSubjectTeachers, error: classroomSubjectTeachersError } = await supabase
        .from("classroom_subject_teachers")
        .select("classroom_subject_id")
        .eq("teacher_id", teacherID)

    
    if (classroomSubjectTeachersError) {
        logError("getTeachingSubject (classroom_subject_teachers)", classroomSubjectTeachersError)
        return { error: classroomSubjectTeachersError, data: null }
    }

    const classroomSubjectIDs = classroomSubjectTeachers?.map((classroomSubjectTeacher) => classroomSubjectTeacher.classroom_subject_id)

    const { data: classroomSubjects, error: classroomSubjectsError } = await supabase
        .from("classroom_subjects")
        .select("subjects(id, name_en, name_th, code_en, code_th, short_name_en, short_name_th), classrooms(id, number)")
        .in("id", classroomSubjectIDs)
        .eq("year", options?.academicYear || getCurrentAcademicYear())
        .eq("semester", options?.semester || getCurrentSemester())

    if (classroomSubjectsError) {
        logError("getTeachingSubject (classroom_subjects)", classroomSubjectsError)
        return { error: classroomSubjectsError, data: null }
    }

    // group classroom subjects by subject
    const groupedClassroomSubjects: SubjectClassrooms[] = []

    classroomSubjects?.forEach((classroomSubject) => {
        const subject = classroomSubject.subjects
        const classroom = classroomSubject.classrooms

        if (!subject) return
        if (!classroom) return

        const subjectIndex = groupedClassroomSubjects.findIndex((groupedClassroomSubject) => groupedClassroomSubject.subject.id === subject?.id)

        if (subjectIndex === -1) {
            groupedClassroomSubjects.push({
                id: subject.id,
                subject: {
                    id: subject?.id ?? "",
                    name: mergeDBLocales(subject, "name"),
                    code: mergeDBLocales(subject, "code"),
                    short_name: mergeDBLocales(subject, "short_name"),
                },
                classrooms: [classroom],
            })
        } else {
            groupedClassroomSubjects[subjectIndex].classrooms.push(classroom)
        }
    }
    )

    return { data: groupedClassroomSubjects, error: null }
    


  }