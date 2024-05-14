import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import { ElectiveSubject } from "@/utils/types/elective";
import { MySKClient } from "@/utils/types/fetch";
import { ShirtSize, Student, UserRole } from "@/utils/types/person";
import { pick, sort } from "radash";

/**
 * Get a list of all Classrooms with their Students for bulk printing.
 *
 * @param supabase The Supabase Client to use.
 * @param mysk The MySK Client to use.
 *
 * @returns A Backend Return with a list of Classrooms.
 */
export default async function getClassroomsForBulkPrint(
  supabase: DatabaseClient,
  mysk: MySKClient,
): Promise<
  BackendReturn<
    (Pick<Classroom, "id" | "number" | "class_advisors"> & {
      students: Student[];
    })[]
  >
> {
  const query = supabase
    .from("classrooms")
    .select(
      `id,
      number,
      classroom_advisors(
        teachers(
          id,
          subject_groups!inner(*),
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
      classroom_students(
        class_no,
        students(
          id,
          student_id,
          people(
            *,
            person_contacts(contacts(*)),
            person_allergies(allergy_name)),
            classroom_students(class_no, classrooms!inner(id, number)
          )
        )
      )`,
    )
    .order("number")
    .eq("year", getCurrentAcademicYear());

  // Exclude test Classrooms in production.
  if (process.env.NODE_ENV !== "development") query.lt("number", 900);

  const { data, error } = await query;
  if (error) {
    logError("getClassroomsForBulkPrint", error);
    return { data: null, error };
  }

  const { data: electives, error: electivesError } = await mysk.fetch<
    ElectiveSubject[]
  >("/v1/subjects/electives", {
    query: {
      fetch_level: "detailed",
      descendant_fetch_level: "id_only",
      filter: { data: { year: getCurrentAcademicYear() } },
    },
  });

  if (electivesError) {
    logError("getClassroomsForBulkPrint (electives)", electivesError);
    return { data: null, error: electivesError };
  }

  const electivesMap = electives.reduce(
    (accumulate, elective) => {
      elective.students.forEach((student) => {
        accumulate[student.id] = pick(elective, [
          "id",
          "session_code",
          "name",
          "code",
          "room",
          "randomized_students",
        ]) as ElectiveSubject;
      });
      return accumulate;
    },
    {} as Record<string, ElectiveSubject>,
  );

  const classrooms = data.map((classroom) => ({
    ...pick(classroom, ["id", "number"]),
    class_advisors: classroom.classroom_advisors?.map((classroomAdvisor) => {
      const teacher = classroomAdvisor.teachers!;
      return {
        id: teacher.id,
        first_name: mergeDBLocales(teacher.people, "first_name"),
        middle_name: mergeDBLocales(teacher.people, "middle_name"),
        last_name: mergeDBLocales(teacher.people, "last_name"),
        subject_group: {
          id: teacher.subject_groups!.id,
          name: mergeDBLocales(teacher.subject_groups, "name"),
        },
        profile: teacher.people?.profile || null,
      };
    }),
    students: sort(
      classroom.classroom_students.map((classroomStudent) => {
        const student = classroomStudent.students!;
        return {
          id: student!.id,
          role: UserRole.student as const,
          prefix: mergeDBLocales(student!.people, "prefix"),
          first_name: mergeDBLocales(student!.people, "first_name"),
          last_name: mergeDBLocales(student!.people, "last_name"),
          nickname: mergeDBLocales(student!.people, "nickname"),
          middle_name: mergeDBLocales(student!.people, "middle_name"),
          citizen_id: null,
          birthdate: null,
          shirt_size: <ShirtSize>student.people?.shirt_size || null,
          pants_size: student.people?.pants_size || null,
          allergies:
            student.people?.person_allergies.map(
              (allergy) => allergy.allergy_name,
            ) || null,
          contacts: [],
          is_admin: null,
          student_id: student.student_id,
          classroom: pick(classroom, ["id", "number"]),
          class_no: classroomStudent.class_no,
          certificates: [],
          chosen_elective: electivesMap[student.id] || null,
          profile: student.people?.profile || null,
          profile_url: student.people?.profile || null,
        };
      }),
      (student) => student.class_no,
    ),
  }));

  return { data: classrooms, error: null };
}
