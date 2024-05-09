import { Student } from "@/utils/types/person";
import { sort } from "radash";

/**
 * Sorts a list of Students in the following order:
 * 1. By Classroom number, with Students without a Classroom at the bottom.
 * 2. By number in Classroom, with Students without a number at the top.
 *
 * @param students The list of Students to sort.
 */
export default function sortStudents(students: Student[]) {
  return sort(
    sort(students, (student) => student.class_no || 0),
    (student) => student.classroom?.number || 1000,
  );
}
