export interface SubjectsGroup {
  id: number;
  subjects: Subject[];
}

export interface Subject {
  id: number;
  name: string;
  member: Teacher[];
}

export interface Teacher {
  id: number;
  name: string;
  classes: number;
  contacts: Contact[];
}

export interface Contact {
  id: number;
  type: "Line" | "Facebook" | "Phone" | "Mail" | "Address" | "Instagram" | "Youtube" | "Discord" | "Twitter" | "Website";
  value: string;
  name: string;
}