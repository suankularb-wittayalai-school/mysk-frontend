export interface SubjectGroupDB {
  id: number;
  created_at: string;
  name_th: string;
  name_en: string;
}

export type subject_type_th =
  | "รายวิชาพื้นฐาน"
  | "รายวิชาเพิ่มเติม"
  | "รายวิชาเลือก"
  | "กิจกรรมพัฒนาผู้เรียน";
export type subject_type_en =
  | "Core Courses"
  | "Elective Courses"
  | "Additional Courses"
  | "Learner’s Development Activities";

export interface SubjectDB {
  id: number;
  created_at: string;
  name_th: string;
  name_en: string;
  code_th: string;
  code_en: string;
  type_th: subject_type_th;
  type_en: subject_type_en;
  credit: number;
  description_th: string;
  description_en: string;
  year: number;
  semester: number;
  group: SubjectGroupDB;
  syllabus: string;
}

export interface SubjectTable {
  id: number;
  created_at: string;
  name_th: string;
  name_en: string;
  code_th: string;
  code_en: string;
  type_th: subject_type_th;
  type_en: subject_type_en;
  credit: number;
  description_th: string;
  description_en: string;
  year: number;
  semester: number;
  group: number;
  syllabus: string;
}
