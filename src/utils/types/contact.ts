export type Contact = {
  id: number;
  name: {
    "en-US": string;
    th: string;
  };
  via: "facebook" | "line" | "discord" | "email";
  includes?: {
    students: boolean;
    parents: boolean;
    teachers: boolean;
  };
  url: string;
};
