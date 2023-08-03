// Imports
import { MultiLangString } from "@/utils/types/common";
import { Organization } from "@/utils/types/organization";

type NewsBase = {
  id: string;
  created_at: string;
  title: MultiLangString;
  description: MultiLangString;
  image: string | null;
  old_url: string | null;
};

export type Info = NewsBase & {
  body: MultiLangString;
};

export type SchoolDocument = {
  id: string;
  type: SchoolDocumentType;
  code: string;
  date: string;
  subject: string;
  attend_to?: string;
  include_students: boolean | null;
  include_parents: boolean | null;
  include_teachers: boolean | null;
  document_link: string;
  organization: Pick<Organization, "id" | "name"> | null;
};

export type SchoolDocumentType =
  | "order" //        คำสั่ง
  | "record" //       บันทึกข้อความ
  | "announcement" // ประกาศ
  | "other"; //       อื่นๆ
