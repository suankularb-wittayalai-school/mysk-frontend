import classroomOfPerson from "@/utils/helpers/classroom/classroomOfPerson";
import { Student, Teacher } from "@/utils/types/person";

/**
 * Check if all the People are in the same Classroom.
 * @param people The People to check.
 * @returns Whether all the People are in the same Classroom.
 */
export default function inSameClassroom(
  ...people: (
    | Pick<Student, "role" | "classroom">
    | Pick<Teacher, "role" | "class_advisor_at">
    | null
  )[]
) {
  // If any of the People is null, return false, as we can't determine if they
  // are in the same Classroom.
  if (people.some((person) => !person)) return false;

  // If everyone has the same Classroom as the first Person, return true.
  return (
    people as (
      | Pick<Student, "role" | "classroom">
      | Pick<Teacher, "role" | "class_advisor_at">
    )[]
  ).every(
    (person) =>
      classroomOfPerson(person)?.id === classroomOfPerson(people[0]!)?.id,
  );
}
