import { Classroom } from "@/utils/types/classroom";
import { MultiLangString } from "@/utils/types/common";
import { Student, Teacher } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";

export type ElectiveSubject = {
  id: string;
  session_code: string;
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
  requirements: MultiLangString[];
  applicable_classrooms: Classroom[];
  room: string;
  type: "elective_course";
  semester: number;
  students: Student[];
  randomized_students: Student[];
};

export type ElectiveTradeOffer = {
  id: string;
  sender: Student;
  receiver: Student;
  sender_elective_subject: ElectiveSubject;
  receiver_elective_subject: ElectiveSubject;
  status: "approved" | "pending" | "declined";
};
