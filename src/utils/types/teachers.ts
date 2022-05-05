import { Teacher } from "./person";

export interface TeachersListGroup {
  groupName: string;
  content: TeacherListContent[];
}

export interface TeacherListContent {
  id: number;
  content: Teacher;
}
