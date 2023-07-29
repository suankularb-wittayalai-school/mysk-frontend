// Types
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";
import { Subject } from "@/utils/types/subject";

export type Classroom = {
  id: string;
  number: number;
  class_advisors: Teacher[];
  contacts: Contact[];
  students: Student[];
  year: number;
  subjects: Subject[];
};
