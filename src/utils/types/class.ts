import { Contact } from "./contact";
import { Student, Teacher } from "./person";
import { SubjectListItem } from "./subject";

export type Class = {
  id: number;
  number: number;
  classAdvisors: Array<Teacher>;
  contacts: Array<Contact>;
  students: Array<Student>;
  year: number;
  subjects: SubjectListItem[];
};

export type ClassWNumber = Pick<Class, "id" | "number">;
