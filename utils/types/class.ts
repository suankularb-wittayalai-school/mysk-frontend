// Types
import { Contact } from "@/utils/types/contact";
import { Person, Student, Teacher } from "@/utils/types/person";
import { SubjectListItem } from "@/utils/types/subject";

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

export type ClassLookupListItem = ClassWNumber & {
  classAdvisors: Pick<Person, "id" | "prefix" | "name">[];
};

export type ClassOverview = Pick<
  Class,
  "number" | "classAdvisors" | "contacts" | "subjects"
>;
