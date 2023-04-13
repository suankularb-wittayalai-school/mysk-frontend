// Types
import { Contact } from "@/utils/types/contact";
import {
  Person,
  PersonLookupItemGeneric,
  Student,
  Teacher,
} from "@/utils/types/person";
import { SubjectGroup, SubjectListItem } from "@/utils/types/subject";

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
  studentCount: number;
};

export type ClassTeachersListSection = {
  subjectGroup: SubjectGroup;
  teachers: PersonLookupItemGeneric<null>[];
};

export type ClassOverview = Pick<
  Class,
  "id" | "number" | "classAdvisors" | "contacts" | "subjects"
>;
