import { DatabaseClient } from "@utils/types/common";

export async function getOnboardStatistic(supabase: DatabaseClient) {
  const { count: teacherOnboardedCount } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .eq("role", '"teacher"')
    .eq("onboarded", true);

  const { count: studentOnboardedCount } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .eq("role", '"student"')
    .eq("onboarded", true);

  // get teacher and student count who have not onboarded
  const { count: teacherNotOnboardedCount } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .eq("role", '"teacher"')
    .eq("onboarded", false);

  const { count: studentNotOnboardedCount } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .eq("role", '"student"')
    .eq("onboarded", false);

  // format into statistics
  const statistics = {
    teacher: {
      complete: teacherOnboardedCount!,
      full: teacherOnboardedCount! + teacherNotOnboardedCount!,
    },
    student: {
      complete: studentOnboardedCount!,
      full: studentOnboardedCount! + studentNotOnboardedCount!,
    },
  };
  return statistics;
}

