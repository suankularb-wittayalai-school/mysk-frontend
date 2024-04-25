import { Student, Teacher, UserRole } from "@/utils/types/person";

export default function classroomOfPerson(
  person:
    | Pick<Student, "role" | "classroom">
    | Pick<Teacher, "role" | "class_advisor_at">,
) {
  return person.role === UserRole.teacher
    ? person.class_advisor_at
    : person.classroom;
}
