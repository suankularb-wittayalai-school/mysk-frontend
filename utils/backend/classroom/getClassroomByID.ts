// Imports
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import { pick } from "radash";

/**
 * Retrieves a Classroom by its ID from the Supabase database.
 *
 * @param supabase The Supabase client to use.
 * @param id The ID of the Classroom to retrieve.
 *
 * @returns A Backend Return of the Classroom.
 */
export default async function getClassroomByID(
  supabase: DatabaseClient,
  id: string,
): Promise<BackendReturn<Classroom>> {
  let query = supabase.from("classrooms").select(
    `id,
    number, 
    main_room,
    classroom_advisors!inner(
      teachers!inner(
        id,
        subject_groups(id, name_en, name_th),
        people(
          first_name_en,
          first_name_th,
          middle_name_en,
          middle_name_th,
          last_name_en,
          last_name_th,
          profile
        )
      )
    ),
    classroom_contacts(contacts!inner(*)),
    year`,
  );

  const { data, error } = await query
    .eq("id", id)
    .limit(1)
    .order("id")
    .single();

  if (error) {
    logError("getClassroomByID", error);
    return { data: null, error };
  }

  const classroom: Classroom = {
    ...pick(data!, ["id", "number", "main_room", "year"]),
    class_advisors: data!.classroom_advisors?.map((advisor) => {
      const teacher = advisor.teachers!;
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
    contacts: data!.classroom_contacts?.map((classroomContact) => {
      const contact = classroomContact.contacts!;
      return {
        name: mergeDBLocales(contact, "name"),
        ...contact,
      };
    }),
    students: [],
    subjects: [],
  };

  return { data: classroom, error: null };
}
