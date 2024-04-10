import { MultiLangString } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import { Student } from "@/utils/types/person";
import { Classroom } from "@/utils/types/classroom";

export type ElectiveSubject = {
  id: string;
  name: MultiLangString;
  short_name: MultiLangString | null;
  code: MultiLangString;
  description: MultiLangString | null;
  teachers: Teacher[];
  co_teachers: Teacher[];
  subject_group: SubjectGroup;
  syllabus: string | null;
  credit: number;
  class_size: number;
  cap_size: number;
  applicable_classrooms: Classroom[];
  room: string;
  students: Student[];
};

export type ElectiveTradeOffer = {
  id: string;
  sender: Student;
  reveiver: Student;
  sender_elective_subject: ElectiveSubject;
  receiver_elective_subject: ElectiveSubject;
  status: "approved" | "pending" | "declined";
};
