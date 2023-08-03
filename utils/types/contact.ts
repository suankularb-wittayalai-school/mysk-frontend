// Types
import { MultiLangString } from "@/utils/types/common";

export type Contact = {
  id: string;
  name: MultiLangString | null | null;
  type: ContactType;
  include_students: boolean | null;
  include_teachers: boolean | null;
  include_parents: boolean | null;
  value: string;
};

export type ContactType =
  | "phone"
  | "email"
  | "facebook"
  | "line"
  | "instagram"
  | "website"
  | "discord"
  | "other";
