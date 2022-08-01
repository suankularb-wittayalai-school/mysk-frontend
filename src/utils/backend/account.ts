import { Session } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";

export function editProfile(formData: FormData) {}

export async function changePassword(
  formData: FormData,
  session: Session | null
) {
  if (!session || !session.user) {
    return false;
  }

  if (formData.get("original-password") === formData.get("new-password")) {
    return false;
  }

  const {
    user,
    session: _,
    error,
  } = await supabase.auth.signIn({
    email: session.user.email,
    password: formData.get("original-password") as string,
  });

  if (error) {
    console.error(error);
    return false;
  }

  const { user: updatedUserData, error: passwordUpdatingError } =
    await supabase.auth.update({
      password: formData.get("new-password") as string,
    });

  if (passwordUpdatingError) {
    console.error(passwordUpdatingError);
    return false;
  }

  return true;
}
