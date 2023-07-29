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
  | "learners_development_activities";

export type Subject = {
  id: string;
  code: Required<MultiLangString>;
  name: MultiLangString;
  short_name: MultiLangString;
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
  teachers: Teacher[];
  co_teachers?: Teacher[];
  ggc_code?: string;
  ggc_link?: string;
  gg_meet_link?: string;
};
