import { MultiLangString } from "./common";

// create type form_type_enum as enum('short_answer', 'paragraph', 'multiple_choice', 'check_box', 'dropdown', 'file', 'date', 'time', 'scale');
export type FieldType =
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "check_box"
  | "dropdown"
  | "file"
  | "date"
  | "time"
  | "scale";

export interface FormField {
  id: number;
  label: MultiLangString;
  type: FieldType;
  options: string[];
  required: boolean;
  range: {
    start: number;
    end: number;
  };
}

export interface Form {
  id: number;
  name: MultiLangString;
  description: MultiLangString;
  fields: FormField[];
  due_date: Date;
  students_done: number;
  frequency: "once" | "weekly" | "monthly" | "unspecified";
}
