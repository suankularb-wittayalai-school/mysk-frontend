import { ClassWName } from "./class";
import { Contact } from "./contact";
import { Subject, SubjectGroup } from "./subject";

export type Prefix = "Master" | "Mr." | "Mrs." | "Miss."

export type Person = {
  id: number;
  prefix: Prefix;
  role: Role;
  name: {
    "en-US"?: PersonName;
    th: PersonName;
  };
  profile?: string;
  citizen_id: string;
  birthdate: string;
  contacts: Contact[];
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
  class: ClassWName;
  classNo: number;
};

export type Teacher = Person & {
  // TODO: Add more properties when the schema is completed
  role: "teacher";
  teacherID: string;
  classAdvisorAt?: ClassWName;
  subject_group: SubjectGroup;
};
