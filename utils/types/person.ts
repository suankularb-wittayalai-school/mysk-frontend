// Types
import { ClassWNumber } from "@/utils/types/class";
import { MultiLangObj, MultiLangString } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { SubjectGroup, SubjectWNameAndCode } from "@/utils/types/subject";

export type UserMetadata = {
  role: Role;
  student?: number;
  teacher?: number;
  isAdmin: boolean;
  onboarded: boolean;
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
  id: number;
  prefix: MultiLangString;
  role: Role;
  name: MultiLangObj<PersonName>;
  profile?: string;
  citizenID?: string;
  birthdate: string;
  shirtSize?: ShirtSize;
  pantsSize?: string;
  allergies?: string;
  contacts: Contact[];
  isAdmin?: boolean;
};

export type PersonWName = {
  id: Person["id"];
  name: Person["name"];
};

export type PersonName = {
  firstName: string;
  middleName?: string;
  lastName: string;
  nickname?: string;
};

export type Role = "student" | "teacher";

export type DefaultTHPrefix = "เด็กชาย" | "นาย" | "นาง" | "นางสาว";
export type DefaultENPrefix = "Master." | "Mr." | "Mrs." | "Miss.";

export type Student = Person & {
  role: "student";
  studentID: string;
  class?: ClassWNumber;
  classNo: number;
};

export type Teacher = Person & {
  role: "teacher";
  teacherID: string;
  classAdvisorAt?: ClassWNumber;
  subjectGroup: SubjectGroup;
  subjectsInCharge?: SubjectWNameAndCode[];
};

export type StudentListItem = {
  id: number;
  classNo: number;
  prefix: MultiLangString;
  name: MultiLangObj<PersonName>;
};

export type PersonLookupItem = {
  id: number;
  prefix: MultiLangString;
  name: MultiLangObj<PersonName>;
} & (
  | { role: "student"; metadata: ClassWNumber }
  | { role: "teacher"; metadata: SubjectGroup }
);

export type PersonLookupItemGeneric<Metadata> = {
  id: number;
  role: Role;
  metadata?: Metadata;
  prefix: MultiLangString;
  name: MultiLangObj<PersonName>;
};

export type StudentAdminListItem = {
  id: number;
  studentID: string;
  classItem: ClassWNumber;
  classNo: number;
  name: MultiLangString;
};

export type ImportedStudentData = {
  prefix: DefaultTHPrefix;
  first_name_th: string;
  first_name_en: string;
  middle_name_th?: string;
  middle_name_en?: string;
  last_name_th: string;
  last_name_en: string;
  birthdate: string;
  citizen_id: number;
  student_id: number;
  class: number;
  class_number: number;
  email: string;
};

export type ImportedTeacherData = {
  prefix: DefaultTHPrefix;
  first_name_th: string;
  first_name_en: string;
  middle_name_th?: string;
  middle_name_en?: string;
  last_name_th: string;
  last_name_en: string;
  birthdate: string;
  citizen_id: number;
  teacher_id: string;
  subject_group:
    | "วิทยาศาสตร์ และเทคโนโลยี"
    | "คณิตศาสตร์"
    | "ภาษาต่างประเทศ"
    | "ภาษาไทย"
    | "สุขศึกษา และพลศึกษา"
    | "การงานอาชีพ"
    | "ศิลปะ"
    | "สังคมศึกษา ศาสนา และวัฒนธรรม"
    | "กิจกรรมพัฒนาผู้เรียน"
    | "อาจารย์พิเศษ";
  email: string;
};
