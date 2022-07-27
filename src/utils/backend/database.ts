import { getCurrentAcedemicYear } from "@utils/helpers/date";
import { supabase } from "@utils/supabaseClient";
import { Class } from "@utils/types/class";
import { Contact } from "@utils/types/contact";
import { ClassroomDB } from "@utils/types/database/class";
import { ContactDB } from "@utils/types/database/contact";
import { InfoDB } from "@utils/types/database/news";
import { StudentDB, TeacherDB } from "@utils/types/database/person";
import { ScheduleItemDB } from "@utils/types/database/schedule";
import {
  RoomSubjectDB,
  SubjectGroupDB,
  SubjectTable,
} from "@utils/types/database/subject";
import { InfoPage, NewsItemInfoNoDate } from "@utils/types/news";
import { Role, Student, Teacher } from "@utils/types/person";
import { SchedulePeriod } from "@utils/types/schedule";
import { Subject, SubjectListItem } from "@utils/types/subject";

export function db2Contact(contact: ContactDB): Contact {
  return {
    id: contact.id,
    name: {
      th: contact.name_th,
      "en-US": contact.name_en ? contact.name_en : "",
    },
    value: contact.value,
    type: contact.type,
  };
}

export function dbInfo2NewsItem(info: InfoDB): NewsItemInfoNoDate {
  return {
    id: info.id,
    type: "info",
    postDate: info.created_at,
    image: info.parent.image
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/news/${info.parent.image}`
      : "",
    done: false,
    content: {
      title: {
        "en-US": info.parent.title_en || "",
        th: info.parent.title_th,
      },
      description: {
        "en-US": info.parent.description_en || "",
        th: info.parent.description_th,
      },
    },
  };
}

export function db2Info(info: InfoDB): InfoPage {
  const newsItemInfo = dbInfo2NewsItem(info);

  return {
    ...newsItemInfo,
    content: {
      ...newsItemInfo.content,
      body: {
        "en-US": info.body_en,
        th: info.body_th,
      },
    },
  };
}

export async function db2Student(student: StudentDB): Promise<Student> {
  const formatted: Student = {
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
    class: {
      id: 0,
      number: 0,
    },
    citizenID: student.people.citizen_id,
    birthdate: student.people.birthdate,

    // TODO: Get classNo
    classNo: 1,
    contacts: [],
  };

  const { data: contacts, error: contactError } = await supabase
    .from<ContactDB>("contact")
    .select("*")
    .in("id", student.people.contacts ? student.people.contacts : []);

  if (contactError) {
    console.error(contactError);
  }
  if (contacts) {
    formatted.contacts = contacts.map(db2Contact);
  }

  const { data: classes, error: classError } = await supabase
    .from<{ id: number; number: number; students: number[] }>("classroom")
    .select("id, number, students")
    .match({ year: getCurrentAcedemicYear() })
    .contains("students", [student.id])
    .limit(1)
    .single();
  if (classError) {
    console.error(classError);
  }
  if (classes) {
    formatted.class = {
      id: classes.id,
      number: classes.number,
    };
  }

  return formatted;
}

export async function db2Teacher(teacher: TeacherDB): Promise<Teacher> {
  const formatted: Teacher = {
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
    classAdvisorAt: {
      id: 0,
      number: 0,
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
    contacts: [],
    subjectsInCharge: [],
  };

  const { data: contacts, error: contactError } = await supabase
    .from<ContactDB>("contact")
    .select("*")
    .in("id", teacher.people.contacts ? teacher.people.contacts : []);

  if (contactError) {
    console.error(contactError);
  }
  if (contacts) {
    formatted.contacts = contacts.map(db2Contact);
  }

  const { data: classes, error: classError } = await supabase
    .from<{ id: number; number: number; advisors: number[] }>("classroom")
    .select("id, number, advisors")
    .match({ year: getCurrentAcedemicYear() })
    .contains("advisors", [teacher.id])
    .limit(1)
    .single();
  if (classError) {
    console.error(classError);
  }
  if (classes) {
    formatted.classAdvisorAt = {
      id: classes.id,
      number: classes.number,
    };
  }

  // get subjects in charge
  const { data: subjects, error: subjectError } = await supabase
    .from<SubjectTable>("subject")
    .select("*")
    .contains("teachers", [teacher.id]);

  if (subjectError) {
    console.error(subjectError);
  }
  if (subjects) {
    formatted.subjectsInCharge = subjects.map((subject) => {
      return {
        id: subject.id,
        code: {
          "en-US": subject.code_en,
          th: subject.code_th,
        },
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
      };
    });
  }

  return formatted;
}

export async function db2Subject(subject: SubjectTable): Promise<Subject> {
  const formatted: Subject = {
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
      id: 0,
      name: {
        "en-US": "",
        th: "",
      },
    },
    syllabus: subject.syllabus,
    // teachers: subject.teachers.map(teacher => teacher.id),
    teachers: [],
    // coTeachers: subject.coTeachers.map(teacher => teacher.id),
    coTeachers: [],
  };

  const { data: subjectGroup, error: subjectGroupError } = await supabase
    .from<SubjectGroupDB>("SubjectGroup")
    .select("*")
    .match({ id: subject.group })
    .limit(1);

  if (subjectGroupError) {
    console.error(subjectGroupError);
  }
  if (subjectGroup) {
    formatted.subjectGroup = {
      id: subjectGroup[0].id,
      name: {
        "en-US": subjectGroup[0].name_en,
        th: subjectGroup[0].name_th,
      },
    };
  }

  const { data: teachers, error: teachersError } = await supabase
    .from<TeacherDB>("teacher")
    .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
    .in("id", subject.teachers);

  if (teachersError) {
    console.error(teachersError);
  }
  if (teachers) {
    formatted.teachers = await Promise.all(
      teachers.map(async (teacher) => {
        return await db2Teacher(teacher);
      })
    );
  }

  const { data: coTeachers, error: coTeachersError } = await supabase
    .from<TeacherDB>("teacher")
    .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
    .in("id", subject.coTeachers ? subject.coTeachers : []);

  if (coTeachersError) {
    console.error(coTeachersError);
  }
  if (coTeachers) {
    formatted.coTeachers = await Promise.all(
      coTeachers.map(async (teacher) => {
        return await db2Teacher(teacher);
      })
    );
  }

  return formatted;
}

export async function db2Class(classDB: ClassroomDB): Promise<Class> {
  const formatted: Class = {
    id: classDB.id,
    number: classDB.number,
    classAdvisors: [],
    students: [],
    subjects: [],
    contacts: [],
    year: classDB.year,
  };

  if (classDB.advisors) {
    const { data: classAdvisor, error: classAdvisorError } = await supabase
      .from<TeacherDB>("teacher")
      .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
      .in("id", classDB.advisors);

    if (classAdvisorError) {
      console.error(classAdvisorError);
    }
    if (classAdvisor) {
      formatted.classAdvisors = await Promise.all(
        classAdvisor.map(async (teacher) => await db2Teacher(teacher))
      );
    }
  }

  if (classDB.students) {
    const { data: students, error: studentsError } = await supabase
      .from<StudentDB>("student")
      .select("id, std_id, people:person(*)")
      .in("id", classDB.students);

    if (studentsError) {
      console.error(studentsError);
    }
    if (students) {
      formatted.students = await Promise.all(
        students.map(async (student) => await db2Student(student))
      );
    }
  }

  if (classDB.contacts) {
    const { data: contacts, error: contactError } = await supabase
      .from<ContactDB>("contact")
      .select("*")
      .in("id", classDB.contacts);

    if (contactError) {
      console.error(contactError);
    }
    if (contacts) {
      formatted.contacts = contacts.map(db2Contact);
    }
  }

  return formatted;
}

export async function db2SchedulePeriod(
  scheduleItem: ScheduleItemDB,
  role: Role
): Promise<SchedulePeriod> {
  const formatted: SchedulePeriod = {
    id: scheduleItem.id,
    startTime: scheduleItem.start_time,
    duration: scheduleItem.duration,
    subject: {
      id: scheduleItem.subject.id,
      name: {
        "en-US": {
          name: scheduleItem.subject.name_en,
          shortName: scheduleItem.subject.short_name_en,
        },
        th: {
          name: scheduleItem.subject.name_th,
          shortName: scheduleItem.subject.short_name_th,
        },
      },
      teachers: [],
      coTeachers: [],
    },
    class: scheduleItem.classroom,
    room: scheduleItem.room,
  };

  if (role == "student" && formatted.subject) {
    const { data: teachers, error: teachersError } = await supabase
      .from<TeacherDB>("teacher")
      .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
      .in("id", scheduleItem.subject.teachers);

    if (teachersError) {
      console.error(teachersError);
    }
    if (teachers) {
      formatted.subject.teachers = await Promise.all(
        teachers.map(async (teacher) => {
          return await db2Teacher(teacher);
        })
      );
    }

    const { data: coTeachers, error: coTeachersError } = await supabase
      .from<TeacherDB>("teacher")
      .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
      .in(
        "id",
        scheduleItem.subject.coTeachers ? scheduleItem.subject.coTeachers : []
      );

    if (coTeachersError) {
      console.error(coTeachersError);
    }
    if (coTeachers) {
      formatted.subject.coTeachers = await Promise.all(
        coTeachers.map(async (teacher) => {
          return await db2Teacher(teacher);
        })
      );
    }
  }

  return formatted;
}

export async function db2SubjectListItem(roomSubject: RoomSubjectDB) {
  const formatted: SubjectListItem = {
    id: roomSubject.id,
    subject: {
      code: {
        "en-US": roomSubject.subject.code_en,
        th: roomSubject.subject.code_th,
      },
      name: {
        "en-US": {
          name: roomSubject.subject.name_en,
          shortName: roomSubject.subject.short_name_en,
        },
        th: {
          name: roomSubject.subject.name_th,
          shortName: roomSubject.subject.short_name_th,
        },
      },
    },
    classroom: {
      id: roomSubject.classroom.id,
      number: roomSubject.classroom.number,
    },
    teachers: [],
    coTeachers: [],
    ggMeetLink: roomSubject.gg_meet_link ? roomSubject.gg_meet_link : "",
    ggcCode: roomSubject.ggc_code ? roomSubject.ggc_code : "",
    ggcLink: roomSubject.ggc_link ? roomSubject.ggc_link : "",
  };

  if (roomSubject.teacher) {
    const { data: teachers, error: teachersError } = await supabase
      .from<TeacherDB>("teacher")
      .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
      .in("id", roomSubject.teacher);

    if (teachersError) {
      console.error(teachersError);
    }
    if (teachers) {
      formatted.teachers = await Promise.all(
        teachers.map(async (teacher) => await db2Teacher(teacher))
      );
    }
  }

  if (roomSubject.coteacher) {
    const { data: coTeachers, error: coTeachersError } = await supabase
      .from<TeacherDB>("teacher")
      .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
      .in("id", roomSubject.coteacher);

    if (coTeachersError) {
      console.error(coTeachersError);
    }
    if (coTeachers) {
      formatted.coTeachers = await Promise.all(
        coTeachers.map(async (teacher) => await db2Teacher(teacher))
      );
    }
  }

  return formatted;
}
