import { Teacher } from "./person";

export interface TeachersListGroup {
  groupName: string;
  content: {
    id: number;
    content: Teacher;
  }[];
}
