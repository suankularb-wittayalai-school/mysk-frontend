import { Teacher } from "./person";

export interface TeachersList {
  groupName: string;
  content: Content[];
}

export interface Content {
  id: number;
  content: Teacher;
}