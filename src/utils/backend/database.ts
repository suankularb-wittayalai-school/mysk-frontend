import { StudentDB, TeacherDB } from "@utils/types/database/person";
import { SubjectDB } from "@utils/types/database/subject";
import { Student, Teacher } from "@utils/types/person";
import { Subject } from "@utils/types/subject";

export async function db2student(student: StudentDB): Promise<Student> {
  return {
    id: student.id,
    prefix: student.people.prefix_en,
    role: "student",
    name: {
      th: {
        firstName: student.people.first_name_th,
        lastName: student.people.last_name_th,
      },
      "en-US": {
        firstName: student.people.first_name_en
          ? student.people.first_name_en
          : "",
        lastName: student.people.last_name_en
          ? student.people.last_name_en
          : "",
      },
    },
    studentID: student.std_id,

    // TODO: Get class
    class: {
      id: 101,
      name: {
        "en-US": "M.101",
        th: "ม.101",
      },
    },
    citizenID: student.people.citizen_id,
    birthdate: student.people.birthdate,

    // TODO: Get classNo
    classNo: 1,

    // TODO: Get contacts
    contacts: [],
  };
}

export async function db2teacher(teacher: TeacherDB): Promise<Teacher> {
  return {
    id: teacher.id,
    role: "teacher",
    prefix: teacher.people.prefix_en,
    name: {
      "en-US": {
        firstName: teacher.people.first_name_en
          ? teacher.people.first_name_en
          : "",
        lastName: teacher.people.last_name_en
          ? teacher.people.last_name_en
          : "",
      },
      th: {
        firstName: teacher.people.first_name_th,
        lastName: teacher.people.last_name_th,
      },
    },
    profile: teacher.people.profile,
    teacherID: teacher.teacher_id,
    // TODO: Class advisor at
    classAdvisorAt: {
      id: 405,
      name: {
        "en-US": "M.405",
        th: "ม.405",
      },
    },
    citizenID: teacher.people.citizen_id,
    birthdate: teacher.people.birthdate,
    subjectGroup: {
      id: teacher.SubjectGroup.id,
      name: {
        "en-US": teacher.SubjectGroup.name_en,
        th: teacher.SubjectGroup.name_th,
      },
    },
    // TODO: Fetch contact
    contacts: [],
  };
}

export async function db2Subject(subject: SubjectDB): Promise<Subject> {
  return {
    id: subject.id,
    name: {
      "en-US": {
        name: subject.name_en,
        shortName: subject.short_name_en,
      },
      th: {
        name: subject.name_th,
        shortName: subject.short_name_th,
      },
    },
    code: {
      "en-US": subject.code_en,
      th: subject.code_th,
    },
    type: {
      "en-US": subject.type_en,
      th: subject.type_th,
    },
    credit: subject.credit,
    description: {
      "en-US": subject.description_en,
      th: subject.description_th,
    },
    year: subject.year,
    semester: subject.semester,
    subjectGroup: {
      id: subject.group.id,
      name: {
        "en-US": subject.group.name_en,
        th: subject.group.name_th,
      },
    },
    syllabus: subject.syllabus,
    // teachers: subject.teachers.map(teacher => teacher.id),
    teachers: [],
    // coTeachers: subject.coTeachers.map(teacher => teacher.id),
    coTeachers: [],
  };
}
