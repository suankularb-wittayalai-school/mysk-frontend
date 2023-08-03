import { logError } from "@/utils/helpers/debug";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Contact } from "@/utils/types/contact";
import { Subject } from "@/utils/types/subject";
import { Student } from "@/utils/types/person";
import { GetServerSidePropsContext } from "next";

import { getCurrentAcademicYear } from "@/utils/helpers/date";

export default async function getStudentsOfClass(
  supabase: DatabaseClient,
  classroomID: string,
  options?: { year?: number },
): Promise<
  BackendReturn<
    Pick<Student, "id" | "first_name" | "last_name" | "nickname" | "class_no">[]
  >
> {
  const { data: students, error } = await supabase
    .from("students")
    .select(
      `
            id,
            people ( first_name_th, last_name_th, nickname_th, first_name_en, last_name_en, nickname_en ),
            classroom_students!inner(class_no, classrooms(id))
            `,
    )
    .eq("classroom_students.classroom_id", classroomID)
    .eq(
      "classroom_students.classrooms.year",
      options?.year ?? getCurrentAcademicYear(),
    );
  // .order("classroom_students.class_no", );

  if (error) {
    logError("getClassStudentList", error);
    return { data: null, error: error };
  }

  const studentList: Pick<
    Student,
    "id" | "first_name" | "last_name" | "nickname" | "class_no"
  >[] = students?.map((student) => {
    const { id, people, classroom_students } = student;
    const {
      first_name_th,
      last_name_th,
      nickname_th,
      first_name_en,
      last_name_en,
      nickname_en,
    } = people!;
    const { class_no } =
      classroom_students.length > 0 ? classroom_students[0] : { class_no: 0 };
    return {
      id,
      first_name: { th: first_name_th, "en-US": first_name_en },
      last_name: { th: last_name_th, "en-US": last_name_en },
      nickname: { th: nickname_th ?? "", "en-US": nickname_en },
      class_no,
    };
  });

  return {
    data: studentList.sort(
      // Put Students with no class No. first
      (a, b) => (a.class_no || 0) - (b.class_no || 0),
    ),
    error: null,
  };
}
