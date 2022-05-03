import { Teacher } from "./person";

export interface TeachersList {
  groupName: string;
  content: TeacherListContent[];
};

export interface TeacherListContent {
  id: number;
  content: Teacher;
};
