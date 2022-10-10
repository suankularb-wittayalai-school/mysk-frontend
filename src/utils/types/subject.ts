import { ClassWNumber } from "./class";
import { Teacher } from "./person";

// Subject Group
export type SubjectGroup = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
};

export type SubjectSubgroup = {
  name: {
    "en-US": string;
    th: string;
  };
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
  code: {
    "en-US": string;
    th: string;
  };
  name: {
    "en-US"?: SubjectName;
    th: SubjectName;
  };
  type: {
    "en-US": SubjectTypeEN;
    th: SubjectTypeTH;
  };
  description?: {
    "en-US": string;
    th: string;
  };
  teachers: Teacher[];
  coTeachers?: Teacher[];
  subjectGroup: SubjectGroup;
  year: number;
  semester: 1 | 2;
  syllabus: string | File | null;
  credit: number;
};

export type SubjectWNameAndCode = {
  id: Subject["id"];
  code: Subject["code"];
  name: Subject["name"];
};

export type SubjectName = {
  name: string;
  shortName?: string;
};

// Subject List Item
export type SubjectListItem = {
  id: number;
  subject: {
    code: Subject["code"];
    name: Subject["name"];
  };
  classroom: ClassWNumber;
  teachers: Array<Teacher>;
  coTeachers?: Array<Teacher>;
  ggcCode?: string;
  ggcLink?: string;
  ggMeetLink?: string;
};

// Period Log
export type PeriodLog = {
  id: number;
  date: Date;
  topic: string;
  mediums: Array<PeriodMedium>;
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
  name: {
    "en-US": string;
    th: string;
  };
  desc: {
    "en-US": string;
    th: string;
  };
  classes: Array<ClassWNumber>;
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
    | "วิทยาศาสตร์"
    | "คณิตศาสตร์"
    | "ภาษาต่างประเทศ"
    | "ภาษาไทย"
    | "สุขศึกษาและพลศึกษา"
    | "การงานอาชีพและเทคโนโลยี"
    | "ศิลปะ"
    | "สังคมศึกษา ศาสนา และวัฒนธรรม"
    | "การศึกษาค้นคว้าด้วยตนเอง";
  credit: number;
  description_th?: string;
  description_en?: string;
  year: number;
  semester: 1 | 2;
};
