import { StudentCertificate } from "@/utils/types/certificate";
import { Classroom } from "@/utils/types/classroom";
import { MultiLangString } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { ElectiveSubject } from "@/utils/types/elective";
import { Subject, SubjectGroup } from "@/utils/types/subject";

/**
 * The role of a user.
 */
export enum UserRole {
  student = "student",
  teacher = "teacher",
  management = "management",
  organization = "organization",
  staff = "staff",
}

/**
 * The key of a User Permission.
 */
export enum UserPermissionKey {
  /**
   * Can see the Manage page and its children.
   */
  can_see_management = "can_see_management",
}

export type User = {
  id: string;
  email: string | null;
  permissions: UserPermissionKey[];
  is_admin: boolean;
  onboarded: boolean;
  role: UserRole;
};

export enum ShirtSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  twoXL = "2XL",
  threeXL = "3XL",
  fourXL = "4XL",
  fiveXL = "5XL",
  sixXL = "6XL",
}

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
  certificates: StudentCertificate[];
  chosen_elective: ElectiveSubject | null;
  role: UserRole.student;
};

export type Teacher = Person & {
  teacher_id: string | null;
  class_advisor_at: Pick<Classroom, "id" | "number"> | null;
  subject_group: SubjectGroup;
  subjects_in_charge: Pick<Subject, "id" | "name" | "code" | "short_name">[];
  role: UserRole.teacher;
};

export type Management = Person & { role: UserRole.management };

export type StudentLookupItem = Pick<
  Student,
  | "id"
  | "prefix"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "nickname"
  | "profile"
  | "role"
  | "classroom"
>;

export type TeacherLookupItem = Pick<
  Teacher,
  | "id"
  | "prefix"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "nickname"
  | "profile"
  | "role"
  | "subject_group"
>;

export type PersonLookupItem = StudentLookupItem | TeacherLookupItem;
