import { ContactDB } from "./contact";
import { StudentDB, StudentTable, TeacherTable } from "./person";
import { ScheduleDB, ScheduleTable } from "./schedule";
import { SubjectTable } from "./subject";

export interface ClassroomDB {
  id: number;
  created_at: string;
  number: string;
  year: number;
  semester: number;
  students: number[];
  advisors: number[];
  schedule: ScheduleTable | null;
  contacts: number[];
  subjects: SubjectTable[];
}
