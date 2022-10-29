import { ClassWNumber } from "./class";
import { MultiLangObj, MultiLangString } from "./common";
import { Contact } from "./contact";
import { SubjectGroup, SubjectWNameAndCode } from "./subject";

export type Person = {
  id: number;
  prefix: MultiLangString;
  role: Role;
  name: MultiLangObj<PersonName>;
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

export type DefaultTHPrefix = "เด็กชาย" | "นาย" | "นาง" | "นางสาว";
export type DefaultENPrefix = "Master." | "Mr." | "Mrs." | "Miss.";

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
  prefix: MultiLangString;
  name: MultiLangObj<PersonName>;
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
