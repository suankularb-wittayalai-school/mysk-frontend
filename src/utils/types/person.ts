import { Subject } from "./subject";

export type Person = {
  id: number;
  prefix: "master" | "mister" | "miss" | "missus";
  name: {
    "en-US": PersonName;
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
  class: string;
  classNo: number;
};

export type Teacher = Person & {
  // TODO: Add more properties when the schema is completed
  role: "teacher";
  subjectsInCharge: Array<{
    id: Subject["id"];
    code: Subject["code"];
    name: Subject["name"];
    subjectSubgroup: Subject["subjectSubgroup"];
  }>;
};
