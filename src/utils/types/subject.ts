import { Teacher } from "./person";

export type Subject = {
  // TODO: Add more properties when the schema is completed
  name: {
    "en-US": SubjectName;
    th: SubjectName;
  };
  teachers: Array<Teacher>;
};

export type SubjectName = {
  name: string;
  shortName?: string;
};
