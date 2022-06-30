import { PersonWName } from "../person";

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
  students_done: PersonWName[];
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
