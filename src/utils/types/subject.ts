import { Teacher } from "./person";

// Subject Group
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
  teachers: Array<Teacher>;
  subjectSubgroup: SubjectSubgroup;
};

export type SubjectNameAndCode = {
  id: Subject["id"];
  code: Subject["code"];
  name: Subject["name"];
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

export type SubjectName = {
  name: string;
  shortName?: string;
};
