export interface ClassroomDB {
  id: number;
  created_at: string;
  number: number;
  year: number;
  students: number[];
  advisors: number[];
  contacts: number[];
  subjects: number[];
  no_list: number[];
}

export interface ClassroomTable {
  id: number;
  created_at: string;
  number: number;
  year: number;
  students: number[];
  advisors: number[];
  contacts: number[];
  subjects: number[];
  no_list: number[];
}
