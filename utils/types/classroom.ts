// Imports
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";
import { Subject } from "@/utils/types/subject";

export type Classroom = {
  id: string;
  number: number;
  main_room: string | null;
  class_advisors: Pick<
    Teacher,
    | "id"
    | "first_name"
    | "middle_name"
    | "last_name"
    | "profile"
    | "subject_group"
  >[];
  contacts: Contact[];
  students: Pick<
    Student,
    | "id"
    | "first_name"
    | "middle_name"
    | "last_name"
    | "nickname"
    | "profile"
    | "class_no"
  >[];
  year: number;
  subjects: Subject[];
};
