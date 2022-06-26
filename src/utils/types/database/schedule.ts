import { ClassWNumber } from "../class";
import { TeacherDB } from "./person";
import { SubjectTable } from "./subject";

export type ScheduleItemDB = {
  id: number;
  created_at: string;
  subject: SubjectTable;
  teacher: TeacherDB;
  coteachers?: TeacherDB[];
  day: number;
  start_time: number;
  duration: number;
  classroom: ClassWNumber;
  room: string;
};

export type ScheduleItemTable = {
  id: number;
  created_at: string;
  subject: number;
  teacher: number;
  coteachers?: number[];
  day: number;
  start_time: number;
  duration: number;
  classroom: number;
  room: string;
};
