// External libraries
import type { User } from "@supabase/supabase-js";

// Types
import {
  BackendAuthReturn,
  BackendDataReturn,
  BackendReturn,
  DatabaseClient,
  OrUndefined,
} from "@/utils/types/common";
import { Role, UserMetadata } from "@/utils/types/person";

export async function getUserMetadata(
  supabase: DatabaseClient,
  id: string
): Promise<BackendDataReturn<UserMetadata, null>> {
  const { data, error } = await supabase
    .from("users")
    .select("role, student, teacher, is_admin, onboarded")
    .match({ id })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return {
    data: {
      role: JSON.parse(data!.role) as Role,
      student: data!.student as OrUndefined<number>,
      teacher: data!.teacher as OrUndefined<number>,
      isAdmin: data!.is_admin,
      onboarded: data!.onboarded,
    },
    error: null,
  };
}

export async function changePassword(
  supabase: DatabaseClient,
  form: {
    originalPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  },
  user: User
): Promise<BackendAuthReturn> {
  const { error: logInError } = await supabase.auth.signInWithPassword({
    email: user.email as string,
    password: form.originalPassword,
  });

  if (logInError) {
    console.error(logInError);
    return { error: logInError };
  }

  const { error: passwordUpdatingError } = await supabase.auth.updateUser({
    password: form.newPassword,
  });

  if (passwordUpdatingError) {
    console.error(passwordUpdatingError);
    return { error: passwordUpdatingError };
  }

  return { error: null };
}
