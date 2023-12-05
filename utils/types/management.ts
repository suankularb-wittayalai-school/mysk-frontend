export type ParticipationMetrics = {
  [key in
    | "onboarded_users"
    | "total_users"
    | "total_teachers"
    | "teachers_with_schedule"
    | "students_with_additional_account_data"
    | "students_with_classroom"]: number;
};
