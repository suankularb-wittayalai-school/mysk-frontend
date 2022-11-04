// External libraries
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { PostgrestError } from "@supabase/supabase-js";

// Backend
import { db2Teacher } from "@utils/backend/database";
import { createPerson } from "@utils/backend/person/person";

// Helpers
import { getCurrentAcedemicYear } from "@utils/helpers/date";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { ClassWNumber } from "@utils/types/class";
import { BackendReturn } from "@utils/types/common";
import { ImportedTeacherData, Role, Teacher } from "@utils/types/person";
import { ClassroomDB } from "@utils/types/database/class";
import {
  PersonDB,
  PersonTable,
  TeacherDB,
  TeacherTable,
} from "@utils/types/database/person";
import { RoomSubjectDB } from "@utils/types/database/subject";

const subjectGroupMap = {
  "วิทยาศาสตร์ และเทคโนโลยี": 1,
  คณิตศาสตร์: 2,
  ภาษาต่างประเทศ: 3,
  ภาษาไทย: 4,
  "สุขศึกษา และพลศึกษา": 5,
  การงานอาชีพ: 6,
  ศิลปะ: 7,
  "สังคมศึกษา ศาสนา และวัฒนธรรม": 8,
  กิจกรรมพัฒนาผู้เรียน: 9,
  อาจารย์พิเศษ: 10,
} as const;

const prefixMap = {
  เด็กชาย: "Master.",
  นาย: "Mr.",
  นาง: "Mrs.",
  นางสาว: "Miss.",
} as const;

export async function getTeacherIDFromReq(
  req: IncomingMessage & { cookies: NextApiRequestCookies },
  res?: ServerResponse
): Promise<number> {
  const { user, error } = await supabase.auth.api.getUserByCookie(req, res);

  if (error || !user) {
    console.error(error);
    return 0;
  }

  return user?.user_metadata.teacher;
}

export async function createTeacher(
  teacher: Teacher,
  email: string,
  isAdmin: boolean = false
): Promise<{ data: TeacherTable | null; error: PostgrestError | null }> {
  const { data: person, error: personCreationError } = await createPerson(
    teacher
  );
  if (personCreationError || !person) {
    console.error(personCreationError);
    return { data: null, error: personCreationError };
  }
  const { data: createdTeacher, error: teacherCreationError } = await supabase
    .from<TeacherTable>("teacher")
    .insert({
      person: person[0]?.id,
      subject_group: teacher.subjectGroup.id,
      // class_advisor_at: form.classAdvisorAt,
      teacher_id: teacher.teacherID.trim(),
    })
    .single();
  if (teacherCreationError || !createdTeacher) {
    console.error(teacherCreationError);
    // delete the created person
    await supabase
      .from<PersonDB>("people")
      .delete()
      .match({ id: person[0]?.id });
    return { data: null, error: teacherCreationError };
  }

  // register an account for the teacher
  await fetch("/api/account/teacher", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      id: createdTeacher.id,
      isAdmin,
    }),
  });

  return { data: createdTeacher, error: null };
}

export async function deleteTeacher(teacher: Teacher) {
  const { data: userid, error: selectingError } = await supabase
    .from<{
      id: string;
      email: string;
      role: Role;
      student: number;
      teacher: number;
    }>("users")
    .select("id")
    .match({ teacher: teacher.id })
    .limit(1)
    .single();

  if (selectingError) {
    console.error(selectingError);
    return;
  }

  if (!userid) {
    console.error("No user found");
    return;
  }

  const { data: deletingTeacher, error: teacherDeletingError } = await supabase
    .from<TeacherTable>("teacher")
    .delete()
    .match({ id: teacher.id });
  if (teacherDeletingError || !deletingTeacher) {
    console.error(teacherDeletingError);
    return;
  }
  // delete the person related to the teacher
  const { data: deletingPerson, error: personDeletingError } = await supabase
    .from<PersonTable>("people")
    .delete()
    .match({ id: deletingTeacher[0].person });
  if (personDeletingError || !deletingPerson) {
    console.error(personDeletingError);
    return;
  }

  // Delete account of the teacher
  const response = await fetch(`/api/account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userid.id,
    }),
  });
  if (!response.ok) {
    console.error("Failed to delete account");
  }
}

export async function importTeachers(data: ImportedTeacherData[]) {
  const teachers: Array<{ person: Teacher; email: string }> = data.map(
    (teacher) => {
      const person: Teacher = {
        id: 0,
        prefix: {
          th: teacher.prefix,
          "en-US": prefixMap[teacher.prefix],
        },
        role: "teacher",
        name: {
          th: {
            firstName: teacher.first_name_th,
            middleName: teacher.middle_name_th,
            lastName: teacher.last_name_th,
          },
          "en-US": {
            firstName: teacher.first_name_en,
            middleName: teacher.middle_name_en,
            lastName: teacher.last_name_en,
          },
        },
        birthdate: teacher.birthdate,
        citizenID: teacher.citizen_id.toString(),
        teacherID: teacher.teacher_id.toString(),
        contacts: [],
        subjectGroup: {
          id: subjectGroupMap[teacher.subject_group],
          name: {
            th: teacher.subject_group,
            "en-US": teacher.subject_group,
          },
        },
      };
      const email = teacher.email;
      return { person, email };
    }
  );

  await Promise.all(
    teachers.map(
      async (teacher) => await createTeacher(teacher.person, teacher.email)
    )
  );
}

export async function getTeacherList(classID: number): Promise<Teacher[]> {
  // Get the teachers of all subjectRooms where class matches
  const { data: roomSubjects, error: roomSubjectsError } = await supabase
    .from<RoomSubjectDB>("room_subjects")
    .select("teacher")
    .match({ class: classID });
  if (roomSubjectsError || !roomSubjects) {
    console.error(roomSubjectsError);
    return [];
  }

  // Map array of teacher IDs into array of teachers (fetch teacher in map)
  const selectedTeachers: (TeacherDB | null)[] = await Promise.all(
    // Flatten the arrays into an array of teacher IDs
    roomSubjects
      .map((roomSubject) => roomSubject.teacher)
      .flat()
      // Remove duplicates
      .filter((id, index, self) => self.indexOf(id) === index)
      // Fetch teacher data for each teacher
      .map(async (teacher_id) => {
        // Get teacher from ID
        const { data, error } = await supabase
          .from<TeacherDB>("teacher")
          .select("* ,people:person(*), SubjectGroup:subject_group(*)")
          .match({ id: teacher_id })
          .limit(1)
          .single();
        if (error || !data) {
          console.error(error);
          return null;
        }
        return data;
      })
  );
  const teachers: TeacherDB[] = selectedTeachers.filter(
    (teacher) => teacher !== null
  ) as TeacherDB[];

  return await Promise.all(
    teachers.map(async (teacher) => await db2Teacher(teacher))
  );
}

export async function getClassAdvisorAt(
  teacherDBID: number
): Promise<BackendReturn<ClassWNumber, null>> {
  const { data, error } = await supabase
    .from<ClassroomDB>("classroom")
    .select("id, number")
    .match({ year: getCurrentAcedemicYear() })
    .contains("advisors", [teacherDBID])
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return { data: data as ClassWNumber, error: null };
}
