// Imports
import { MultiLangString } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { Classroom } from "@/utils/types/classroom";
import { SubjectGroup, Subject } from "@/utils/types/subject";

export type UserRole =
  | "student"
  | "teacher"
  | "organization"
  | "staff"
  | "management";

export type User = {
  id: string;
  email: string | null;
  is_admin: boolean;
  onboarded: boolean;
  role: UserRole;
};

export type ShirtSize =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "2XL"
  | "3XL"
  | "4XL"
  | "5XL"
  | "6XL";

export type Person = {
  id: string;
  prefix: MultiLangString;
  first_name: MultiLangString;
  last_name: MultiLangString;
  middle_name: MultiLangString | null;
  nickname: MultiLangString | null;
  profile: string | null;
  citizen_id: string | null;
  birthdate: string;
  shirt_size: ShirtSize | null;
  pants_size: string | null;
  allergies: string[] | null;
  contacts: Contact[];
};

export type Student = Person & {
  student_id: string;
  classroom?: Pick<Classroom, "id" | "number">;
  class_no: number;
  role: "student";
};

export type Teacher = Person & {
  teacher_id: string;
  class_advisor_at: Pick<Classroom, "id" | "number"> | null; 
  subject_group: SubjectGroup; 
  subjects_in_charge: Pick<Subject, "id" | "name" | "code">[]; 
  role: "teacher";
};
