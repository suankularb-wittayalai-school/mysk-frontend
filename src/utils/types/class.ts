import { Student, Teacher } from "./person";

export type Class = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
  classAdvisors: Array<Teacher>;
  students: Array<Student>;
};
