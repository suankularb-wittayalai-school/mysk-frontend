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
  // TODO: Add more properties when the schema is completed
  name: {
    "en-US": SubjectName;
    th: SubjectName;
  };
  teachers?: Array<Teacher>;
  subjectSubgroup: SubjectSubgroup;
};

export type SubjectName = {
  name: string;
  shortName?: string;
};
