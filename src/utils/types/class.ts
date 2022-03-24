import { Student, Teacher } from "./person";

export type Class = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
  classAdvisors: Array<Teacher>;
  contacts: Array<Contact>;
  students: Array<Student>;
};

export type Contact = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
  via: "facebook" | "line" | "discord" | "email";
  includes: {
    students: boolean;
    parents: boolean;
    teachers: boolean;
  };
  url: string;
};
