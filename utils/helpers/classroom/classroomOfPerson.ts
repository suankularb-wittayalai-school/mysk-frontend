import { Student, Teacher, UserRole } from "@/utils/types/person";

/**
 * Index into the Person to get the Classroom they are in. For Teachers, this
 * is the Classroom they are the Class Advisor of.
 * 
 * @param person The Person to get the Classroom of.
 * 
 * @returns The Classroom the Person is in.
 */
export default function classroomOfPerson(
  person:
    | Pick<Student, "role" | "classroom">
    | Pick<Teacher, "role" | "class_advisor_at">,
) {
  return person.role === UserRole.teacher
    ? person.class_advisor_at
    : person.classroom;
}
