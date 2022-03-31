import { Teacher } from "./person";

export type SubjectGroup = {
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
  teachers: Array<Teacher>;
  subjectSubgroup: SubjectSubgroup;
};

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

export type SubjectName = {
  name: string;
  shortName?: string;
};
