import { TeacherDB } from "./person";
import { SubjectDB } from "./subject";

export type ScheduleItemDB = {
  id: number;
  created_at: string;
  subject: SubjectDB;
  teacher: TeacherDB;
  coteachers?: TeacherDB[];
  day: number;
  start_time: number;
  duration: number;
  room: string;
};
