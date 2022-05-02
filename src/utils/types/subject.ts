import { ClassWName } from "./class";
import { Teacher } from "./person";

// Subject Group
export type SubjectGroup = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
};

export type SubjectSubgroup = {
  name: {
    "en-US": string;
    th: string;
  };
  subjectGroup: SubjectGroup;
};

// Subject
export type Subject = {
  id: number;
  code: {
    "en-US": string;
    th: string;
  };
  name: {
    "en-US": SubjectName;
    th: SubjectName;
  };
  teachers: Teacher[];
  coTeachers?: Teacher[];
  subjectGroup: SubjectGroup;
  year: number;
  semester: 1 | 2;
};

export type SubjectWNameAndCode = {
  id: Subject["id"];
  code: Subject["code"];
  name: Subject["name"];
};

export type SubjectName = {
  name: string;
  shortName?: string;
};

// Subject List Item
export type SubjectListItem = {
  id: number;
  subject: {
    code: Subject["code"];
    name: Subject["name"];
  };
  teachers: Array<Teacher>;
  ggcCode?: string;
  ggcLink?: string;
  ggMeetLink?: string;
};

// Period Log
export type PeriodLog = {
  id: number;
  date: Date;
  topic: string;
  mediums: Array<PeriodMedium>;
  participationLevel: 1 | 2 | 3 | 4 | 5;
  evidence: string;
};

export type PeriodMedium =
  | "meet"
  | "pre-recorded"
  | "material"
  | "assignment"
  | "on-site";

// Substitue Assignment
export type SubstituteAssignment = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
  desc: {
    "en-US": string;
    th: string;
  };
  classes: Array<ClassWName>;
  subject: SubjectWNameAndCode;
};
