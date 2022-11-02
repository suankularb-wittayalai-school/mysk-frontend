import { Contact } from "./contact";
import { Student, Teacher } from "./person";
import { SubjectListItem } from "./subject";

export type Class = {
  id: number;
  number: number;
  classAdvisors: Teacher[];
  contacts: Contact[];
  students: Student[];
  year: number;
  subjects: SubjectListItem[];
};

export type ClassWNumber = Pick<Class, "id" | "number">;
