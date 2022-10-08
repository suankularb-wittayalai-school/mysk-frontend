import { ClassWNumber } from "./class";
import { MultiLangString } from "./common";
import { Contact } from "./contact";
import { SubjectGroup, SubjectWNameAndCode } from "./subject";

export type Prefix = "Master" | "Mr." | "Mrs." | "Miss.";

export type Person = {
  id: number;
  prefix: Prefix;
  role: Role;
  name: {
    "en-US"?: PersonName;
    th: PersonName;
  };
  profile?: string;
  citizenID: string;
  birthdate: string;
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

export type Student = Person & {
  // TODO: Add more properties when the schema is completed
  role: "student";
  studentID: string;
  class: ClassWNumber;
  classNo: number;
};

export type Teacher = Person & {
  // TODO: Add more properties when the schema is completed
  role: "teacher";
  teacherID: string;
  classAdvisorAt?: ClassWNumber;
  subjectGroup: SubjectGroup;
  subjectsInCharge?: SubjectWNameAndCode[];
};

export type StudentListItem = {
  id: number;
  classNo: number;
  prefix: Prefix;
  name: {
    "en-US"?: PersonName;
    th: PersonName;
  };
};

export type ImportedStudentData = {
  prefix: "เด็กชาย" | "นาย" | "นาง" | "นางสาว";
  first_name_th: string;
  first_name_en: string;
  middle_name_th?: string;
  middle_name_en?: string;
  last_name_th: string;
  last_name_en: string;
  birthdate: string;
  citizen_id: number;
  student_id: number;
  class_number: number;
  email: string;
};

export type ImportedTeacherData = {
  prefix: "เด็กชาย" | "นาย" | "นาง" | "นางสาว";
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
    | "วิทยาศาสตร์"
    | "คณิตศาสตร์"
    | "ภาษาต่างประเทศ"
    | "ภาษาไทย"
    | "สุขศึกษาและพลศึกษา"
    | "การงานอาชีพและเทคโนโลยี"
    | "ศิลปะ"
    | "สังคมศึกษา ศาสนา และวัฒนธรรม"
    | "การศึกษาค้นคว้าด้วยตนเอง";
  email: string;
};
