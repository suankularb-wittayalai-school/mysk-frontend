export type Contact = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
  via:
    | "phone"
    | "email"
    | "facebook"
    | "line"
    | "instagram"
    | "website"
    | "discord"
    | "other";
  includes?: {
    students: boolean;
    parents: boolean;
    teachers: boolean;
  };
  value: string;
};
