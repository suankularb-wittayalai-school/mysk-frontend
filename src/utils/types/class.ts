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
  semester: 1 | 2; // TODO: we dont need this
  subjects: SubjectListItem[];
};

export type ClassWNumber = {
  id: Class["id"];
  number: Class["number"];
};
