// External libraries
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

// Supabase
import { supabase } from "@utils/supabaseClient";

export async function setAuthCookies(
  event: AuthChangeEvent,
  session?: Session
): Promise<boolean> {
  const { ok } = await fetch(`/api/account/cookie`, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify({ event, session }),
  });
  return ok;
}

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
