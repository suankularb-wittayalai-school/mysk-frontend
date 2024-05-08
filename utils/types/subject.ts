// Imports
import { Classroom } from "@/utils/types/classroom";
import { MultiLangString } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";

export type SubjectGroup = {
  id: number;
  name: Required<MultiLangString>;
};

export type SubjectTypeEnum =
  | "core_course"
  | "additional_course"
  | "learners_development_activities"
  | "elective_course";

export type Subject = {
  id: string;
  code: Required<MultiLangString>;
  name: MultiLangString;
  short_name: MultiLangString | null;
  type: SubjectTypeEnum;
  description?: MultiLangString;
  teachers: Teacher[];
  co_teachers?: Teacher[];
  subject_group: SubjectGroup;
  semester: 1 | 2;
  syllabus: string | null;
  credit: number;
};

export type ClassroomSubject = {
  id: string;
  subject: Pick<Subject, "id" | "name" | "code">;
  classroom: Pick<Classroom, "id" | "number">;
  teachers: Pick<Teacher, "id" | "first_name" | "last_name">[];
  co_teachers: Pick<Teacher, "id" | "first_name" | "last_name">[] | null;
  ggc_code: string | null;
  ggc_link: string | null;
  gg_meet_link: string | null;
};

export type SubjectClassrooms = {
  id: string;
  subject: Pick<Subject, "id" | "name" | "code" | "short_name">;
  classrooms: Pick<Classroom, "id" | "number">[];
};

export type SubjectGroupTeachers = {
  subject_group: SubjectGroup;
  teachers: Pick<
    Teacher,
    "id" | "role" | "prefix" | "first_name" | "last_name"
  >[];
};
