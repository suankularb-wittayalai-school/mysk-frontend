import { FieldType } from "../form";

export interface FormTable {
  id: number;
  created_at: Date;
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  parent: number;
  due_date: Date;
  students_done: number[];
  frequency: "once" | "weekly" | "monthly" | "unspecified";
}

export interface FormQuestionsTable {
  id: number;
  form: number;
  label_th: string;
  label_en?: string;
  type: FieldType;
  options: string[];
  required: boolean;
  range_start: number;
  range_end: number;
}
