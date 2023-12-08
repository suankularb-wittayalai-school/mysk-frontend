// Imports
import { MultiLangString } from "@/utils/types/common";
import { Organization } from "@/utils/types/organization";

export type NewsArticle = {
  id: string;
  created_at: string;
  title: MultiLangString;
  description: MultiLangString;
  body: MultiLangString;
  image: string | null;
  old_url: string | null;
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

export enum SchoolDocumentType {
  order = "order", //                 คำสั่ง
  record = "record", //               บันทึกข้อความ
  announcement = "announcement", //   ประกาศ
  big_garuda = "big_garuda", //       หนังสือออก (Garuda refers to ครุฑ)
  rules = "rules",
  other = "other", //                 อื่นๆ
}
