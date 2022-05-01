export type Contact = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
  type:
  | "Phone"
  | "Email"
  | "Facebook"
  | "Line"
  | "Instagram"
  | "Website"
  | "Discord"
  | "Other";
  includes?: {
    students: boolean;
    parents: boolean;
    teachers: boolean;
  };
  value: string;
};
