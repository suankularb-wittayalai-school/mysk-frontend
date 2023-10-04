import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";

export default async function getClassroomOverview(
  supabase: DatabaseClient,
  classID: string,
  options?: { academicYear: number },
): Promise<
  BackendReturn<
    Pick<
      Classroom,
      "id" | "number" | "class_advisors" | "contacts" | "subjects"
    >
  >
> {
  const { data: classroom, error: classroomError } = await supabase
    .from("classrooms")
    .select(
      `id,
      number,
      classroom_advisors!inner(
        teachers!inner(
          id,
          subject_groups(*),
          people(
            first_name_en,
            first_name_th,
            last_name_en,
            last_name_th,
            middle_name_en,
            middle_name_th,
            profile
          )
        )
      ),
      classroom_contacts(contacts!inner(*))`,
    )
    .eq("id", classID)
    .eq("year", options?.academicYear || getCurrentAcademicYear())
    .single();

  if (classroomError) {
    logError("getClassroomOverview (classrooms)", classroomError);
    return { error: classroomError, data: null };
  }

  return {
    error: null,
    data: {
      id: classroom?.id ?? "",
      number: classroom?.number ?? "",
      class_advisors: classroom?.classroom_advisors?.map((classroomAdvisor) => {
        const teacher = classroomAdvisor.teachers!;
        return {
          id: teacher.id,
          first_name: mergeDBLocales(teacher.people, "first_name"),
          last_name: mergeDBLocales(teacher.people, "last_name"),
          middle_name: mergeDBLocales(teacher.people, "middle_name"),
          subject_group: {
            id: teacher.subject_groups?.id ?? 0,
            name: mergeDBLocales(teacher.subject_groups, "name"),
          },
          profile: teacher.people!.profile,
        };
      }),
      contacts: classroom?.classroom_contacts?.map((classroomContact) => {
        const contact = classroomContact.contacts!;
        return {
          name: mergeDBLocales(contact, "name"),
          ...contact,
        };
      }),
      subjects: [], // TODO: add subjects
    },
  };
}
