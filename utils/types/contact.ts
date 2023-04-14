// Types
import { MultiLangString } from "@/utils/types/common";

export type Contact = {
  id: number;
  name?: MultiLangString;
  type: ContactVia;
  includes?: {
    students: boolean;
    parents: boolean;
    teachers: boolean;
  };
  value: string;
};

export type ContactVia =
  | "Phone"
  | "Email"
  | "Facebook"
  | "Line"
  | "Instagram"
  | "Website"
  | "Discord"
  | "Other";
