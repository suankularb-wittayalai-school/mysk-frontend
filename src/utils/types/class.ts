import { Contact } from "./contact";
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

export type ClassWName = {
  id: Class["id"];
  name: Class["name"];
}