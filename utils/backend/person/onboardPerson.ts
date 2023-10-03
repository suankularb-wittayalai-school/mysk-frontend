import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Student, Teacher } from "@/utils/types/person";

export async function onboardPerson(
  supabase: DatabaseClient,
  person: Student | Teacher,
  options?: { includeContacts: boolean; detailed?: boolean },
): Promise<BackendReturn<string>> {
  let userID: string | null = null;

  if (person.role === "student") {
    const { data: user, error: userError } = await supabase
      .from("students")
      .select("user_id")
      .eq("id", person.id)
      .single();

    if (userError) {
      logError("onboardPerson (students)", userError);
      return { data: null, error: userError };
    }
    userID = user!.user_id;
  } else if (person.role === "teacher") {
    const { data: user, error: userError } = await supabase
      .from("teachers")
      .select("user_id")
      .eq("id", person.id)
      .single();

    if (userError) {
      logError("onboardPerson (teachers)", userError);
      return { data: null, error: userError };
    }
    userID = user!.user_id;
  }

  if (userID === null) {
    logError("onboardPerson", { message: "Invalid person role" });
    return { data: null, error: { message: "Invalid person role" } };
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .update({
      onboarded: true,
    })
    .eq("id", userID)
    .select("id")
    .single();

  if (userError) {
    logError("onboardPerson (users)", userError);
    return { data: null, error: userError };
  }

  return { data: user.id, error: null };
}
