// Imports
import { MultiLangString } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { Classroom } from "@/utils/types/classroom";
import { SubjectGroup, Subject } from "@/utils/types/subject";

export enum UserRole {
  student = "student",
  teacher = "teacher",
}

export enum UserPermissionKey {
  can_see_management = "can_see_management",
}

export type UserPermissions = {
  [key in UserPermissionKey]: boolean;
};

export type User = {
  id: string;
  email: string | null;
  permissions: UserPermissions;
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
  birthdate: string | null;
  shirt_size: ShirtSize | null;
  pants_size: string | null;
  allergies: string[] | null;
  contacts: Contact[];
  is_admin: boolean | null;
};

export type Student = Person & {
  student_id: string;
  classroom: Pick<Classroom, "id" | "number"> | null;
  class_no: number | null;
  role: UserRole.student;
};

export type Teacher = Person & {
  teacher_id: string | null;
  class_advisor_at: Pick<Classroom, "id" | "number"> | null;
  subject_group: SubjectGroup;
  subjects_in_charge: Pick<Subject, "id" | "name" | "code" | "short_name">[];
  role: UserRole.teacher;
};

export type StudentLookupItem = Pick<
  Student,
  | "id"
  | "prefix"
  | "first_name"
  | "last_name"
  | "middle_name"
  | "nickname"
  | "role"
  | "classroom"
>;

export type TeacherLookupItem = Pick<
  Teacher,
  | "id"
  | "prefix"
  | "first_name"
  | "last_name"
  | "middle_name"
  | "nickname"
  | "role"
  | "subject_group"
>;

export type PersonLookupItem = StudentLookupItem | TeacherLookupItem;
