export type AdminPanelStatistics = {
  students: { all: number; onboarded: number };
  teachers: { all: number; onboarded: number };
  classes: { all: number; thisYear: number };
  news: { all: number; thisYear: number };
  lastUpdated: number;
};

export type IndividualOnboardingStatus = {
  id: number;
  name: string;
  dataChecked: boolean;
  passwordSet: boolean;
};
