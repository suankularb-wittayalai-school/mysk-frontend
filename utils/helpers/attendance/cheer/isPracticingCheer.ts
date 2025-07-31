import { Student } from "@/utils/types/person";

export default function isPracticingCheer(student: Student | null): boolean {
  if (!student?.classroom) return false;
  const grade = Math.floor(student.classroom.number / 100).toString();
  // Grade 9 is included for testing accounts.
  return /^(2|3|4|9)$/.test(grade);
}
