import { SubjectTypeTH, SubjectTypeEN } from "@utils/types/subject";
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
  semester: number;
  group: SubjectGroupDB;
  syllabus: string;
  teachers: TeacherDB[];
  coTeachers?: TeacherDB[];
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
  semester: number;
  group: number;
  syllabus: string;
  short_name_th: string;
  short_name_en: string;
  teachers: number[];
  coTeachers?: number[];
}
