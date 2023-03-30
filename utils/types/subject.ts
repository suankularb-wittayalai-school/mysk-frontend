// Types
import { ClassWNumber } from "@/utils/types/class";
import { MultiLangString } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";

// Subject Group
export type SubjectGroup = {
  id: number;
  name: Required<MultiLangString>;
};

export type SubjectSubgroup = {
  name: Required<MultiLangString>;
  subjectGroup: SubjectGroup;
};

export type SubjectTypeTH =
  | "รายวิชาพื้นฐาน"
  | "รายวิชาเพิ่มเติม"
  | "รายวิชาเลือก"
  | "กิจกรรมพัฒนาผู้เรียน";

export type SubjectTypeEN =
  | "Core Courses"
  | "Elective Courses"
  | "Additional Courses"
  | "Learner’s Development Activities";

// Subject
export type Subject = {
  id: number;
  code: Required<MultiLangString>;
  name: MultiLangString;
  type: Required<MultiLangString>;
  description?: MultiLangString;
  teachers: Teacher[];
  coTeachers?: Teacher[];
  subjectGroup: SubjectGroup;
  year: number;
  semester: 1 | 2;
  syllabus: string | File | null;
  credit: number;
};

export type SubjectWNameAndCode = Pick<Subject, "id" | "code" | "name">;

export type SubjectName = {
  name: string;
  shortName?: string;
};

// Subject List Item
export type SubjectListItem = {
  id: number;
  subject: Pick<Subject, "code" | "name">;
  classroom: ClassWNumber;
  teachers: Teacher[];
  coTeachers?: Teacher[];
  ggcCode?: string;
  ggcLink?: string;
  ggMeetLink?: string;
};

// Subjects List Item for Teachers
export type TeacherSubjectItem = {
  id: number;
  subject: Pick<Subject, "code" | "name">;
  classes: ClassWNumber[];
};

// Period Log
export type PeriodLog = {
  id: number;
  date: Date;
  topic: string;
  mediums: PeriodMedium[];
  participationLevel: 1 | 2 | 3 | 4 | 5;
  evidence: string;
};

export type PeriodMedium =
  | "meet"
  | "pre-recorded"
  | "material"
  | "assignment"
  | "on-site";

// Substitute Assignment
export type SubstituteAssignment = {
  id: number;
  name: MultiLangString;
  desc: MultiLangString;
  classes: ClassWNumber[];
  subject: SubjectWNameAndCode;
};

// As imported from CSV
export type ImportedSubjectData = {
  name_th: string;
  name_en: string;
  short_name_th?: string;
  short_name_en?: string;
  code_th: string;
  code_en: string;
  type:
    | "รายวิชาพื้นฐาน"
    | "รายวิชาเพิ่มเติม"
    | "รายวิชาเลือก"
    | "กิจกรรมพัฒนาผู้เรียน";
  group:
    | "วิทยาศาสตร์ และเทคโนโลยี"
    | "คณิตศาสตร์"
    | "ภาษาต่างประเทศ"
    | "ภาษาไทย"
    | "สุขศึกษา และพลศึกษา"
    | "การงานอาชีพ"
    | "ศิลปะ"
    | "สังคมศึกษา ศาสนา และวัฒนธรรม"
    | "กิจกรรมพัฒนาผู้เรียน";
  credit: number;
  description_th?: string;
  description_en?: string;
  year: number;
  semester: 1 | 2;
};
