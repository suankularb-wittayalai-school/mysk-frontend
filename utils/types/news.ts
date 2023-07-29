// Imports
import { MultiLangString } from "@/utils/types/common";
import { Organization } from "@/utils/types/organization";


type NewsBase = {
  id: string;
  created_at: string;
  title: MultiLangString;
  description: MultiLangString;
  image?: string;
  old_url?: string;
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
  include_students?: boolean;
  include_parents?: boolean;
  include_teachers?: boolean;
  document_link: string;
  organization: Pick<Organization, "id" | "name">;
};

export type SchoolDocumentType =
  | "order" //        คำสั่ง
  | "record" //       บันทึกข้อความ
  | "announcement" // ประกาศ
  | "other"; //       อื่นๆ
