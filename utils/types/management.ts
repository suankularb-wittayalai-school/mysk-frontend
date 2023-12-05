export type ParticipationMetrics = {
  [key in
    | "onboarded_users"
    | "total_users"
    | "teachers_with_schedule"
    | "teachers_with_assigned_subjects"
    | "students_with_additional_account_data"
    | "students_with_classroom"]: number;
};
