import { SubjectTypeTH, SubjectTypeEN } from "@utils/types/subject";
import { ClassroomTable } from "./class";
import { TeacherDB } from "./person";

export interface SubjectGroupDB {
  id: number;
  created_at: string;
  name_th: string;
  name_en: string;
}

export interface SubjectDB {
  id: number;
  created_at: string;
  name_th: string;
  name_en: string;
  code_th: string;
  code_en: string;
  type_th: SubjectTypeTH;
  type_en: SubjectTypeEN;
  credit: number;
  description_th: string;
  description_en: string;
  year: number;
  semester: 1 | 2;
  group: SubjectGroupDB;
  syllabus: string;
  teachers: TeacherDB[];
  coTeachers?: TeacherDB[];
  short_name_th: string;
  short_name_en: string;
}

export interface SubjectTable {
  id: number;
  created_at: string;
  name_th: string;
  name_en: string;
  code_th: string;
  code_en: string;
  type_th: SubjectTypeTH;
  type_en: SubjectTypeEN;
  credit: number;
  description_th: string;
  description_en: string;
  year: number;
  semester: 1 | 2;
  group: number;
  syllabus: string;
  short_name_th: string;
  short_name_en: string;
  teachers: number[];
  coTeachers?: number[];
}

export interface RoomSubjectTable {
  id: number;
  created_at: string;
  subject: number;
  class: number;
  teacher: number[];
  coteacher?: number[];
  ggc_code: string;
  ggc_link: string;
  gg_meet_link: string;
}

export interface RoomSubjectDB {
  id: number;
  created_at: string;
  subject: SubjectTable;
  classroom: ClassroomTable;
  teacher: number[];
  coteacher?: number[];
  ggc_code: string;
  ggc_link: string;
  gg_meet_link: string;
}
