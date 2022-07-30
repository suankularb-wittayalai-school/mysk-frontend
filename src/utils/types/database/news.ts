import { FieldType, FormField } from "../news";

export type NewsDB = {
  id: number;
  created_at: string;
  title_th: string;
  title_en?: string;
  description_th: string;
  description_en?: string;
  image?: string;
  old_url?: string;
};

export type InfoDB = {
  id: number;
  created_at: string;
  body_th: string;
  body_en?: string;
  parent: NewsDB;
};

export type FormDB = {
  id: number;
  created_at: string;
  due_date?: string;
  fields: FormField[];
  students_done: number[];
  frequency: "once" | "weekly" | "monthly";
  parent: NewsDB;
};

export type NewsTable = {
  id: number;
  created_at: string;
  title_th: string;
  title_en?: string;
  description_th: string;
  description_en?: string;
  image?: string;
  old_url?: string;
};

export type InfoTable = {
  id: number;
  body_th: string;
  body_en?: string;
  parent: number;
};

export type FormTable = Omit<FormDB, "students_done" | "parent"> & {
  students_done: number[];
  parent: number;
};

export type FormQuestionsTable = {
  id: number;
  form: number;
  label_th: string;
  label_en?: string;
  type: FieldType;
  options: string[];
  required: boolean;
  range_start: number;
  range_end: number;
  default?: string;
};

export type FormSubmissionTable = {
  id: number;
  created_at: string;
  form: number;
  person: number | null;
};

export type FormFieldValueTable = {
  id: number;
  created_at: string;
  field: number;
  value: string;
  submission: number;
};
