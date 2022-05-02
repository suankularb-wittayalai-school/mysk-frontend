import { TeacherDB } from "./person";
import { SubjectDB } from "./subject";

export interface ScheduleItemDB {
  id: number;
  created_at: string;
  subject: SubjectDB;
  teacher: TeacherDB;
  coTeachers?: TeacherDB[];
  day: number;
  start_time: number;
  duration: number;
  room: string;
}

export interface ScheduleItemTable {
  id: number;
  created_at: string;
  subject: number;
  teacher: number;
  coTeachers?: number[];
  day: number;
  start_time: number;
  duration: number;
  room: string;
}

export interface ScheduleRowDB {
  id: number;
  created_at: string;
  day: number;
  n_periods: number;
  periods: ScheduleItemDB[];
}

export interface ScheduleRowTable {
  id: number;
  created_at: string;
  day: number;
  n_periods: number;
  periods: number[];
}

export interface ScheduleDB {
    id: number;
    created_at: string;
    schedule_rows: ScheduleRowDB[];
    year: number;
    semester: number;
}

export interface ScheduleTable {
    id: number;
    created_at: string;
    schedule_rows: number[];
    year: number;
    semester: number;
}
