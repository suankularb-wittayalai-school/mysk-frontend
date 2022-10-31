// External libraries
import { createClient, User } from "@supabase/supabase-js";

// Types
import { Database } from "@utils/types/supabase";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function changePassword(
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
