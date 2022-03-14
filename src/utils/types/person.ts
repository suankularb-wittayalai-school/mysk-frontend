import { SubjectMini } from "./subject";

export type Person = {
  id: number;
  name: {
    "en-US": PersonName;
    th: PersonName;
  };
  profile?: string;
};

export type PersonName = {
  firstName: string;
  middleName?: string;
  lastName: string;
  nickname?: string;
};

export type Teacher = Person & {
  // TODO: Add more properties when the schema is completed
  subjectsInCharge: Array<SubjectMini>;
};
