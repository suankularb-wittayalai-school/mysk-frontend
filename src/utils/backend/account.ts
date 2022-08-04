// External libraries
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

// Supabase
import { supabase } from "@utils/supabaseClient";
import { Prefix } from "@utils/types/person";

export async function setAuthCookies(
  event: AuthChangeEvent,
  session?: Session
) {
  await fetch(`/api/account/cookie`, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify({ event, session }),
  });
}

export async function editProfile(form: {
  prefix: Prefix;
  thFirstName: string;
  thMiddleName: string | undefined;
  thLastName: string;
  enFirstName: string;
  enMiddleName: string;
  enLastName: string;
}) {}

export async function changePassword(
  formData: FormData,
  session: Session | null
) {
  if (!session || !session.user) return false;

  if (formData.get("original-password") === formData.get("new-password"))
    return false;

  const { session: _, error } = await supabase.auth.signIn({
    email: session.user.email,
    password: formData.get("original-password") as string,
  });

  if (error) {
    console.error(error);
    return false;
  }

  const { error: passwordUpdatingError } = await supabase.auth.update({
    password: formData.get("new-password") as string,
  });

  if (passwordUpdatingError) {
    console.error(passwordUpdatingError);
    return false;
  }

  return true;
}
