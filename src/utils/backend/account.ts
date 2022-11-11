// External libraries
import { User } from "@supabase/supabase-js";

// Types
import { BackendDataReturn, DatabaseClient } from "@utils/types/common";
import { Role, UserMetadata } from "@utils/types/person";

export async function getUserMetadata(
  supabase: DatabaseClient,
  id: string
): Promise<BackendDataReturn<UserMetadata, null>> {
  const { data, error } = await supabase
    .from("users")
    .select("role, is_admin, onboarded")
    .match({ id })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return {
    data: {
      role: data.role as Role,
      isAdmin: data.is_admin,
      onboarded: data.onboarded,
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
) {
  const { error: logInError } = await supabase.auth.signInWithPassword({
    email: user.email as string,
    password: form.originalPassword,
  });

  if (logInError) {
    console.error(logInError);
    return;
  }

  const { error: passwordUpdatingError } = await supabase.auth.updateUser({
    password: form.newPassword,
  });

  if (passwordUpdatingError) {
    console.error(passwordUpdatingError);
    return;
  }
}
