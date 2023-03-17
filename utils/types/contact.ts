export type Contact = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
  type: ContactVia;
  includes?: {
    students: boolean;
    parents: boolean;
    teachers: boolean;
  };
  value: string;
};

export type ContactVia =
  | "Phone"
  | "Email"
  | "Facebook"
  | "Line"
  | "Instagram"
  | "Website"
  | "Discord"
  | "Other";
