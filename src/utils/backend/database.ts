// Helpers
import { getCurrentAcademicYear } from "@utils/helpers/date";

// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { Class } from "@utils/types/class";
import { OrUndefined, DatabaseClient } from "@utils/types/common";
import { Contact } from "@utils/types/contact";
import {
  FormField,
  FormPage,
  InfoPage,
  NewsItemFormNoDate,
  NewsItemInfoNoDate,
  SchoolDocument,
} from "@utils/types/news";
import { Role, Student, Teacher } from "@utils/types/person";
import { SchedulePeriod } from "@utils/types/schedule";
import { Subject, SubjectListItem } from "@utils/types/subject";
import { Database } from "@utils/types/supabase";

// Contact
export function db2Contact(
  contact: Database["public"]["Tables"]["contact"]["Row"]
): Contact {
  return {
    id: contact.id,
    name: {
      th: contact.name_th,
      "en-US": contact.name_en ? contact.name_en : "",
    },
    value: contact.value,
    type: contact.type,
    includes: {
      students: contact.include_students ?? false,
      parents: contact.include_parents ?? false,
      teachers: contact.include_teachers ?? false,
    },
  };
}

// News

// Info
export function dbInfo2NewsItem(
  info: Database["public"]["Tables"]["infos"]["Row"]
): NewsItemInfoNoDate {
  return {
    id: info.id,
    type: "info",
    postDate: info.created_at,
    image: info.parent.image
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/news/${info.parent.image}`
      : "",
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

export function db2InfoPage(
  info: Database["public"]["Tables"]["infos"]["Row"]
): InfoPage {
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

// Form
export function dbForm2NewsItem(
  form: Database["public"]["Tables"]["forms"]["Row"],
  studentID?: number
): NewsItemFormNoDate {
  const formatted: NewsItemFormNoDate = {
    id: form.id,
    type: "form",
    postDate: form.created_at,
    content: {
      title: {
        "en-US": form.parent.title_en || "",
        th: form.parent.title_th,
      },
      description: {
        "en-US": form.parent.description_en || "",
        th: form.parent.description_th,
      },
    },
    dueDate: form.due_date as OrUndefined<string>,
    done: studentID
      ? Boolean(
          (form.students_done || []).find((student) => studentID == student)
        )
      : false,
  };

  return formatted;
}

export function db2Field(
  field: Database["public"]["Tables"]["form_questions"]["Row"]
) {
  const formatted: FormField = {
    id: field.id,
    label: {
      "en-US": field.label_en as OrUndefined<string>,
      th: field.label_th,
    },
    type: field.type,
    required: field.required,
    options: field.options || [],
    range: {
      start: field.range_start as number,
      end: field.range_end as number,
    },
    default: field.default,
  };
  return formatted;
}

export async function db2FormPage(
  form: Database["public"]["Tables"]["forms"]["Row"]
) {
  const formatted: FormPage = {
    id: form.id,
    type: "form",
    postDate: form.created_at,
    content: {
      title: {
        "en-US": form.parent.title_en || "",
        th: form.parent.title_th,
      },
      description: {
        "en-US": form.parent.description_en || "",
        th: form.parent.description_th,
      },
      fields: [],
    },
    dueDate: form.due_date as OrUndefined<string>,
    frequency: form.frequency as FormPage["frequency"],
  };

  const { data: fields, error: fieldsError } = await supabase
    .from("form_questions")
    .select("*")
    .eq("form", form.id);

  if (fieldsError) console.error(fieldsError);
  if (fields)
    formatted.content.fields = fields.map(db2Field).sort((a, b) => a.id - b.id);

  return formatted;
}

// People

// Student
export async function db2Student(
  supabase: DatabaseClient,
  student: Database["public"]["Tables"]["student"]["Row"],
  options?: Partial<{ contacts: boolean }>
): Promise<Student> {
  const formatted: Student = {
    id: student.id,
    prefix: {
      th: student.person.prefix_th,
      "en-US": student.person.prefix_en as OrUndefined<string>,
    },
    role: "student",
    name: {
      th: {
        firstName: student.person.first_name_th,
        middleName: student.person.middle_name_th as OrUndefined<string>,
        lastName: student.person.last_name_th,
      },
      "en-US": {
        firstName: student.person.first_name_en || "",
        middleName: student.person.middle_name_en as OrUndefined<string>,
        lastName: student.person.last_name_en || "",
      },
    },
    studentID: student.std_id,
    class: { id: 0, number: 0 },
    citizenID: student.person.citizen_id,
    birthdate: student.person.birthdate,
    classNo: 1,
    contacts: [],
  };

  if (options?.contacts) {
    const { data: contacts, error: contactError } = await supabase
      .from("contact")
      .select("*")
      .in("id", student.person.contacts ? student.person.contacts : []);

    if (contactError) console.error(contactError);
    if (contacts) formatted.contacts = contacts.map(db2Contact);
  }

  const { data: classes, error: classError } = await supabase
    .from("classroom")
    .select("id, number, students, no_list")
    .match({ year: getCurrentAcademicYear() })
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
    formatted.classNo = classes.no_list.indexOf(student.id) + 1;
  }

  return formatted;
}

// Teacher
export async function db2Teacher(
  supabase: DatabaseClient,
  teacher: Database["public"]["Tables"]["teacher"]["Row"],
  options?: Partial<{ contacts: boolean }>
): Promise<Teacher> {
  const formatted: Teacher = {
    id: teacher.id,
    role: "teacher",
    prefix: {
      th: teacher.person.prefix_th,
      "en-US": teacher.person.prefix_en as OrUndefined<string>,
    },
    name: {
      th: {
        firstName: teacher.person.first_name_th,
        middleName: teacher.person.middle_name_th as OrUndefined<string>,
        lastName: teacher.person.last_name_th,
      },
      "en-US": {
        firstName: teacher.person.first_name_en || "",
        middleName: teacher.person.middle_name_en as OrUndefined<string>,
        lastName: teacher.person.last_name_en || "",
      },
    },
    profile: teacher.person.profile as OrUndefined<string>,
    teacherID: teacher.teacher_id,
    citizenID: teacher.person.citizen_id,
    birthdate: teacher.person.birthdate,
    subjectGroup: {
      id: teacher.subject_group.id,
      name: {
        "en-US": teacher.subject_group.name_en,
        th: teacher.subject_group.name_th,
      },
    },
    contacts: [],
    subjectsInCharge: [],
  };

  if (options?.contacts) {
    const { data: contacts, error: contactError } = await supabase
      .from("contact")
      .select("*")
      .in("id", teacher.person.contacts ? teacher.person.contacts : []);

    if (contactError) console.error(contactError);

    if (contacts) formatted.contacts = contacts.map(db2Contact);
  }

  const { data: classItem, error: classError } = await supabase
    .from("classroom")
    .select("id, number, advisors")
    .match({ year: getCurrentAcademicYear() })
    .contains("advisors", [teacher.id])
    .limit(1)
    .maybeSingle();

  if (classError) console.error(classError);

  if (classItem) {
    formatted.classAdvisorAt = {
      id: classItem.id,
      number: classItem.number,
    };
  }

  // get subjects in charge
  const { data: subjects, error: subjectError } = await supabase
    .from("subject")
    .select("*")
    .contains("teachers", [teacher.id]);

  if (subjectError) {
    console.error(subjectError);
  }
  if (subjects) {
    formatted.subjectsInCharge = subjects.map((subject) => ({
      id: subject.id,
      code: {
        "en-US": subject.code_en,
        th: subject.code_th,
      },
      name: {
        "en-US": {
          name: subject.name_en,
          shortName: subject.short_name_en as OrUndefined<string>,
        },
        th: {
          name: subject.name_th,
          shortName: subject.short_name_th as OrUndefined<string>,
        },
      },
    }));
  }

  return formatted;
}

export async function db2Subject(
  supabase: DatabaseClient,
  subject: Database["public"]["Tables"]["subject"]["Row"]
): Promise<Subject> {
  const formatted: Subject = {
    id: subject.id,
    name: {
      "en-US": {
        name: subject.name_en,
        shortName: subject.short_name_en as OrUndefined<string>,
      },
      th: {
        name: subject.name_th,
        shortName: subject.short_name_th as OrUndefined<string>,
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
      "en-US": subject.description_en || "",
      th: subject.description_th || "",
    },
    year: subject.year,
    semester: subject.semester as 1 | 2,
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
    .from("SubjectGroup")
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
    .from("teacher")
    .select("*, person(*), subject_group(*)")
    .in("id", subject.teachers);

  if (teachersError) {
    console.error(teachersError);
  }

  if (teachers) {
    formatted.teachers = await Promise.all(
      teachers.map(async (teacher) => {
        return await db2Teacher(supabase, teacher);
      })
    );
  }

  const { data: coTeachers, error: coTeachersError } = await supabase
    .from("teacher")
    .select("*, person(*), subject_group(*)")
    .in("id", subject.coTeachers ? subject.coTeachers : []);

  if (coTeachersError) {
    console.error(coTeachersError);
  }
  if (coTeachers) {
    formatted.coTeachers = await Promise.all(
      coTeachers.map(async (teacher) => {
        return await db2Teacher(supabase, teacher);
      })
    );
  }

  return formatted;
}

export async function db2Class(
  supabase: DatabaseClient,
  classDB: Database["public"]["Tables"]["classroom"]["Row"]
): Promise<Class> {
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
      .from("teacher")
      .select("*, person(*), subject_group(*)")
      .in("id", classDB.advisors);

    if (classAdvisorError) {
      console.error(classAdvisorError);
    }

    if (classAdvisor) {
      formatted.classAdvisors = await Promise.all(
        classAdvisor.map(async (teacher) => await db2Teacher(supabase, teacher))
      );
    }
  }

  if (classDB.students) {
    const { data: students, error: studentsError } = await supabase
      .from("student")
      .select("*, person(*)")
      .in("id", classDB.students);

    if (studentsError) {
      console.error(studentsError);
    }
    if (students) {
      formatted.students = await Promise.all(
        students.map(async (student) => await db2Student(supabase, student))
      );
    }
  }

  if (classDB.contacts) {
    const { data: contacts, error: contactError } = await supabase
      .from("contact")
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
  supabase: DatabaseClient,
  scheduleItem: Database["public"]["Tables"]["schedule_items"]["Row"],
  role: Role
): Promise<SchedulePeriod> {
  const formatted: SchedulePeriod = {
    id: scheduleItem.id,
    startTime: scheduleItem.start_time,
    duration: scheduleItem.duration,
    content: [
      {
        id: scheduleItem.id,
        startTime: scheduleItem.start_time,
        duration: scheduleItem.duration,
        subject: {
          id: scheduleItem.subject.id,
          name: {
            "en-US": {
              name: scheduleItem.subject.name_en,
              shortName: scheduleItem.subject
                .short_name_en as OrUndefined<string>,
            },
            th: {
              name: scheduleItem.subject.name_th,
              shortName: scheduleItem.subject
                .short_name_th as OrUndefined<string>,
            },
          },
          teachers: [],
          coTeachers: [],
        },
        class: scheduleItem.classroom,
        room: scheduleItem.room,
      },
    ],
  };

  if (role == "student" && formatted.content.length > 0) {
    formatted.content[0].subject.teachers = [
      await db2Teacher(supabase, scheduleItem.teacher),
    ];

    const { data: coTeachers, error: coTeachersError } = await supabase
      .from("teacher")
      .select("*, person(*), subject_group(*)")
      .in("id", scheduleItem.coteachers || []);

    if (coTeachersError) {
      console.error(coTeachersError);
    }
    if (coTeachers) {
      formatted.content[0].subject.coTeachers = await Promise.all(
        coTeachers.map(async (teacher) => {
          return await db2Teacher(supabase, teacher);
        })
      );
    }
  }

  return formatted;
}

export async function db2SubjectListItem(
  supabase: DatabaseClient,
  roomSubject: Database["public"]["Tables"]["room_subjects"]["Row"]
) {
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
          shortName: roomSubject.subject.short_name_en as OrUndefined<string>,
        },
        th: {
          name: roomSubject.subject.name_th,
          shortName: roomSubject.subject.short_name_th as OrUndefined<string>,
        },
      },
    },
    classroom: roomSubject.class,
    teachers: [],
    coTeachers: [],
    ggMeetLink: roomSubject.gg_meet_link ? roomSubject.gg_meet_link : "",
    ggcCode: roomSubject.ggc_code ? roomSubject.ggc_code : "",
    ggcLink: roomSubject.ggc_link ? roomSubject.ggc_link : "",
  };

  if (roomSubject.teacher) {
    const { data: teachers, error: teachersError } = await supabase
      .from("teacher")
      .select("*, person(*), subject_group(*)")
      .in("id", roomSubject.teacher);

    if (teachersError) {
      console.error(teachersError);
    }
    if (teachers) {
      formatted.teachers = await Promise.all(
        teachers.map(async (teacher) => await db2Teacher(supabase, teacher))
      );
    }
  }

  if (roomSubject.coteacher) {
    const { data: coTeachers, error: coTeachersError } = await supabase
      .from("teacher")
      .select("*, person(*), subject_group(*)")
      .in("id", roomSubject.coteacher);

    if (coTeachersError) {
      console.error(coTeachersError);
    }
    if (coTeachers) {
      formatted.coTeachers = await Promise.all(
        coTeachers.map(async (teacher) => await db2Teacher(supabase, teacher))
      );
    }
  }

  return formatted;
}

export function db2SchoolDocument(
  schoolDocument: Database["public"]["Tables"]["school_documents"]["Row"]
) {
  const formatted: SchoolDocument = {
    id: schoolDocument.id,
    code: schoolDocument.code,
    date: schoolDocument.date,
    subject: schoolDocument.subject,
    attendTo: schoolDocument.attend_to as OrUndefined<string>,
    includes: {
      students: schoolDocument.include_students ?? false,
      parents: schoolDocument.include_parents ?? false,
      teachers: schoolDocument.include_teachers ?? false,
    },
    documentLink: schoolDocument.document_link,
  };

  return formatted;
}
