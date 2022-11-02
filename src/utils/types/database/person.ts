import { Prefix } from "../person";
import { ContactDB } from "./contact";
import { SubjectGroupDB } from "./subject";

export type PrefixTH = "เด็กชาย" | "นาย" | "นาง" | "นางสาว";
export interface PersonDB {
  id: number;
  created_at: string;
  prefix_en: Prefix;
  prefix_th: PrefixTH;
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
}

export interface StudentDB {
  id: number;
  created_at: string;
  std_id: string;
  people: PersonTable;
}

export interface TeacherDB {
  id: number;
  created_at: string;
  people: PersonTable;
  teacher_id: string;
  SubjectGroup: SubjectGroupDB;
}

export interface PersonTable {
  id: number;
  created_at: string;
  prefix_en: Prefix;
  prefix_th: PrefixTH;
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
}

export interface StudentTable {
  id: number;
  created_at: string;
  std_id: string;
  person: number;
}

export interface TeacherTable {
  id: number;
  created_at: string;
  person: number;
  teacher_id: string;
  subject_group: number;
}

export interface FetchedTeacherTable {
  id: number;
  created_at: string;
  people: PersonTable;
  teacher_id: string;
  subject_group: SubjectGroupDB;
}
