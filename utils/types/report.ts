import { Classroom } from "./classroom";
import { Teacher } from "./person";
import { Subject } from "./subject";

export type Report = {
  id: string;
  subject: Subject;
  teacher: Teacher;
  classroom: Classroom;
  date: Date;
  teaching_method: string[];
  teaching_topic: string;
  suggestions: string;
  image_url: string;
  absent_student_no: string[];
  start_time: number;
  duration: number;
};
