// External libraries
import { User } from "@supabase/supabase-js";

export async function changePassword(
  form: {
    originalPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  },
  user: User
) {
  if (form.originalPassword === form.newPassword) return false;

  const { error } = await supabase.auth.signIn({
    email: user.email,
    password: form.originalPassword,
  });

  if (error) {
    console.error(error);
    return false;
  }

  const { error: passwordUpdatingError } = await supabase.auth.update({
    password: form.newPassword,
  });

  if (passwordUpdatingError) {
    console.error(passwordUpdatingError);
    return false;
  }

  return true;
}
