export type Person = {
  name: {
    "en-US": PersonName;
    th: PersonName;
  };
};

export type PersonName = {
  firstName: string;
  middleName?: string;
  lastName: string;
  nickname?: string;
};

export type Teacher = Person & {
  // TODO: Add more properties when the schema is completed
};
