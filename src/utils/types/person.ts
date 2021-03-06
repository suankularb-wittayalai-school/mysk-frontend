import { ClassWNumber } from "./class";
import { Contact } from "./contact";
import { Subject, SubjectGroup, SubjectWNameAndCode } from "./subject";

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
