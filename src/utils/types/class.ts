import { Contact } from "./contact";
import { Student, Teacher } from "./person";
import { StudentSchedule } from "./schedule";
import { SubjectListItem } from "./subject";

export type Class = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
  classAdvisors: Array<Teacher>;
  contacts: Array<Contact>;
  students: Array<Student>;
  year: number;
  semester: 1 | 2;
  schedule: StudentSchedule;
  subjects: SubjectListItem[];
};

export type ClassWName = {
  id: Class["id"];
  name: Class["name"];
};
