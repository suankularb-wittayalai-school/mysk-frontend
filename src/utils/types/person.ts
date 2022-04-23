import { ClassWName } from "./class";
import { Subject } from "./subject";

export type Person = {
  id: number;
  prefix: "master" | "mister" | "miss" | "missus";
  role: Role;
  name: {
    "en-US"?: PersonName;
    th: PersonName;
  };
  profile?: string;
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
  subjectsInCharge: Array<{
    id: Subject["id"];
    code: Subject["code"];
    name: Subject["name"];
    subjectSubgroup: Subject["subjectSubgroup"];
  }>;
};
