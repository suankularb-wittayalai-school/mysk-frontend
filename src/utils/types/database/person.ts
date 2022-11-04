import { ContactDB } from "./contact";
import { SubjectGroupDB } from "./subject";

export type PersonDB = {
  id: number;
  created_at: string;
  prefix_en: string;
  prefix_th: string;
  first_name_th: string;
  last_name_th: string;
  middle_name_th?: string;
  first_name_en?: string;
  last_name_en?: string;
  middle_name_en?: string;
  birthdate: string;
  citizen_id: string;
  profile?: string;
  contacts: ContactDB[];
};

export type StudentDB = {
  id: number;
  created_at: string;
  std_id: string;
  people: PersonTable;
};

export type TeacherDB = {
  id: number;
  created_at: string;
  people: PersonTable;
  teacher_id: string;
  SubjectGroup: SubjectGroupDB;
};

export type PersonTable = {
  id: number;
  created_at: string;
  prefix_en: string;
  prefix_th: string;
  first_name_th: string;
  last_name_th: string;
  middle_name_th?: string;
  first_name_en?: string;
  last_name_en?: string;
  middle_name_en?: string;
  birthdate: string;
  citizen_id: string;
  profile?: string;
  contacts?: number[];
};

export type StudentTable = {
  id: number;
  created_at: string;
  std_id: string;
  person: number;
};

export type TeacherTable = {
  id: number;
  created_at: string;
  person: number;
  teacher_id: string;
  subject_group: number;
};

export interface FetchedTeacherTable {
  id: number;
  created_at: string;
  people: PersonTable;
  teacher_id: string;
  subject_group: SubjectGroupDB;
};
